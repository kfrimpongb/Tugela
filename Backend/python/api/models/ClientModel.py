from typing import Optional

from pydantic import BaseModel


class ClientModel(BaseModel):
    client_id: Optional[str] = None
    entity_name: str
    entity_id: str
    first_name: str
    middle_name: str
    last_name: str
    email: str
    phone: str
    address: str
    city: str
    country: str
    currency: str
    join_date: str
