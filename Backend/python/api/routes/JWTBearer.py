

from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from datetime import datetime, timedelta

SECRET_KEY = "90909jnj935cxjrf"  # Use a secure secret key
ALGORITHM = "HS256"

class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)
        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(status_code=403, detail="Invalid authentication scheme.")
            if not self.verify_jwt(credentials.credentials):
                raise HTTPException(status_code=403, detail="Invalid token or expired token.")
            return credentials.credentials
        else:
            raise HTTPException(status_code=403, detail="Invalid authorization code.")

    def verify_jwt(self, jwtoken: str) -> bool:
        isTokenValid: bool = False

        try:
            payload = jwt.decode(jwtoken, SECRET_KEY, algorithms=[ALGORITHM])
        except JWTError:
            payload = None
        if payload:
            isTokenValid = True
        return isTokenValid

    def get_jwt_subject(self, jwtoken: str):
        try:
            payload = jwt.decode(jwtoken, SECRET_KEY, algorithms=[ALGORITHM])
            return payload.get("sub")
        except JWTError:
            return None
