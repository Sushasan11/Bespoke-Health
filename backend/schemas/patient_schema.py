from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


# Schema for patient signup
class PatientSignupSchema(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)


# Schema for patient login
class PatientLoginSchema(BaseModel):
    email: EmailStr
    password: str


# Schema for updating patient profile
class PatientUpdateSchema(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = Field(None, ge=0)
    gender: Optional[str] = None
    address: Optional[str] = None
    phonenumber: Optional[str] = None

    class Config:
        from_attributes = True


# Schema for requesting a password reset (OTP request)
class PasswordResetRequest(BaseModel):
    email: EmailStr


# Schema for OTP verification
class OTPVerifyRequest(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6, pattern=r"^\d{6}$")


# Schema for changing the password after OTP verification
class PasswordChangeRequest(BaseModel):
    session_token: str
    new_password: str = Field(..., min_length=8)


# Schema for appointment details
class AppointmentSchema(BaseModel):
    id: int
    doctor_id: int
    patient_id: int
    department: str
    appointment_date: datetime
    status: str

    class Config:
        from_attributes = True


# Schema for medicine details
class MedicineSchema(BaseModel):
    id: int
    patient_id: int
    medicine_name: str
    dosage: str
    prescribed_by: str


# Schema for patient profile (including appointments and medicines)
class PatientProfileSchema(BaseModel):
    id: int
    email: EmailStr
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    phonenumber: Optional[str] = None
    kyc_status: str
    appointments: List[AppointmentSchema] = []
    medicines: List[MedicineSchema] = []

    class Config:
        from_attributes = True
