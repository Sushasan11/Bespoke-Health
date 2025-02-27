from pydantic import BaseModel, EmailStr


class AdminLoginSchema(BaseModel):
    email: EmailStr
    password: str


class Config:
    from_attributes = True
