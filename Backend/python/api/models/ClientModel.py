from typing import Optional

from pydantic import BaseModel


class ClientModel(BaseModel):
    client_id: Optional[str] = None
    entity_name:  Optional[str] = None
    entity_id: Optional[str] = None
    first_name: Optional[str] = None
    middle_name: Optional[str] = None
    last_name: Optional[str] = None
    password: Optional[str] = None
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    currency: Optional[str] = None
    join_date: Optional[str] = None
    customer_type: Optional[str] = None
