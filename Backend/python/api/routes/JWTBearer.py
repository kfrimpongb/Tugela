import sqlite3

from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from datetime import datetime, timedelta

from Backend.python.models.RecommendationEngine import RecommendationEngine, params, RE

SECRET_KEY = "90909jnj935cxjrf"  # Use a secure secret key
ALGORITHM = "HS256"


class JWTBearer(HTTPBearer):
    def __init__(self, db_file: str):
        super().__init__()
        self.conn = None
        self.db_file = db_file
        self.connect()

    def connect(self):
        try:
            self.conn = sqlite3.connect(self.db_file, timeout=10)
            print("Connected to SQLite database")
        except sqlite3.Error as e:
            raise HTTPException(status_code=500, detail=f"Error connecting to SQLite database: {e}")

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super().__call__(request)
        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(status_code=403, detail="Invalid authentication scheme.")
            if not self.verify_jwt(credentials.credentials):
                raise HTTPException(status_code=403, detail="Invalid token or expired token.")
            client_id = self.get_client_id_from_token(credentials.credentials)
            if not client_id:
                raise HTTPException(status_code=403, detail="Token not found in token table.")
            return client_id
        else:
            raise HTTPException(status_code=403, detail="Invalid authorization code.")

    def verify_jwt(self, jwtoken: str) -> bool:
        try:
            payload = jwt.decode(jwtoken, SECRET_KEY, algorithms=[ALGORITHM])
            return True
        except JWTError:
            return False

    def is_token_in_table(self, token: str) -> bool:
        if not self.conn:
            self.connect()

        cursor = self.conn.cursor()
        cursor.execute("SELECT client_id FROM tokens_table WHERE access_token = ?", (token,))
        result = cursor.fetchone()
        if result:
            return result[0]  # Return client_id if token exists
        return None

    def get_client_id_from_token(self, token: str) -> int:
        client_id = self.is_token_in_table(token)
        return client_id

    def get_jwt_subject(self, jwtoken: str):
        try:
            payload = jwt.decode(jwtoken, SECRET_KEY, algorithms=[ALGORITHM])
            return payload.get("sub")
        except JWTError:
            return None