from pydantic import BaseModel


class ClientModel(BaseModel):
    client_id: str
    client_name: str
    email: str
    phone: str
    address: str
    city: str
    country: str
