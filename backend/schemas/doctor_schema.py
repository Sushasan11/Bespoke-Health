from pydantic import BaseModel, EmailStr, Field


class DoctorSignup(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)


class DoctorLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
