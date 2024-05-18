from pydantic import BaseModel
from typing import Any


class ApiResponse(BaseModel):
    message: str
    data: Any
