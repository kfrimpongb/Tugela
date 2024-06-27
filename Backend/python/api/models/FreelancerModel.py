from typing import Optional, List

from pydantic import BaseModel


class FreelancerModel(BaseModel):
    freelancer_id: Optional[str] = None
    first_name: Optional[str] = None
    middle_name: Optional[str] = None
    last_name: Optional[str] = None
    email: str
    skills: Optional[List[str]] = None
    experience: str
    linkedin_url: str
    country: Optional[str] = None
    base_currency: Optional[str] = None
    password: Optional[str] = None
    join_date: Optional[str] = None