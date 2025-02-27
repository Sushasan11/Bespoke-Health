from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


class PatientSignupSchema(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)


class PatientUpdateSchema(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    phonenumber: Optional[str] = None

    class Config:
        from_attributes = True


class PatientLoginSchema(BaseModel):
    email: EmailStr
    password: str


class PasswordResetRequestSchema(BaseModel):
    email: EmailStr


class OTPVerificationSchema(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6, pattern=r"^\d{6}$")


class PasswordResetSchema(BaseModel):
    email: EmailStr
    new_password: str = Field(..., min_length=8)
    otp: str = Field(..., min_length=6, max_length=6, pattern=r"^\d{6}$")


class AppointmentSchema(BaseModel):
    id: int
    doctor_id: int
    patient_id: int
    department: str
    appointment_date: datetime
    status: str

    class Config:
        from_attributes = True


class MedicineSchema(BaseModel):
    id: int
    patient_id: int
    medicine_name: str
    dosage: str
    prescribed_by: str


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
