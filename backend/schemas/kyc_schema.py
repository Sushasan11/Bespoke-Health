from pydantic import BaseModel


class ApproveKycSchema(BaseModel):
    user_id: int
    role: str
    approved: bool

    class Config:
        from_attributes = True
