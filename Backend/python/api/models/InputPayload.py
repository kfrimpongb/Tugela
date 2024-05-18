from pydantic import BaseModel


class InputPayload(BaseModel):
    freelancer_id: int
    top_n: int
