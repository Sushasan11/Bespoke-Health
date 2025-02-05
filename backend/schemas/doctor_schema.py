from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class DoctorSignup(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)


class DoctorLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)


class DoctorKYCUpdate(BaseModel):
    name: str
    specialization: str
    experience: int
    phonenumber: str
    address: str
    qualification: str
    profile_picture: Optional[bytes] = None
