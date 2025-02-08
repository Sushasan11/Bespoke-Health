from pydantic import BaseModel, EmailStr, Field
from typing import Optional


# Schema for doctor signup (without file uploads)
class DoctorSignup(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    name: str
    specialization: str
    experience: int
    phonenumber: str
    address: str
    qualification: str


# Schema for doctor login
class DoctorLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)


# Schema for updating KYC details
class DoctorKYCUpdate(BaseModel):
    name: Optional[str] = None
    specialization: Optional[str] = None
    experience: Optional[int] = None
    phonenumber: Optional[str] = None
    address: Optional[str] = None
    qualification: Optional[str] = None


# Schema for admin KYC approval
class KYCApprovalSchema(BaseModel):
    status: str
