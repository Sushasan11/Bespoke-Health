from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class DoctorSignupSchema(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    name: str
    department_id: int
    experience: int
    phonenumber: str
    address: str
    qualification: str


class DoctorSignupForm(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    name: str
    department_id: int
    experience: int
    phonenumber: str
    address: str
    qualification: str


class DoctorLoginSchema(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)


class DoctorProfileSchema(BaseModel):
    id: int
    user_id: int
    email: EmailStr
    name: str
    department_id: Optional[int]
    experience: int
    phonenumber: str
    address: str
    qualification: str
    profile_picture_url: Optional[str]
    degree_certificate_url: Optional[str]
    kyc_status: str

    class Config:
        orm_mode = True


class DoctorUpdateSchema(BaseModel):
    name: Optional[str]
    department_id: Optional[int]
    experience: Optional[int]
    phonenumber: Optional[str]
    address: Optional[str]
    qualification: Optional[str]

    class Config:
        from_attributes = True
