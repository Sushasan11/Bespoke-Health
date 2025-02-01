from pydantic import BaseModel, EmailStr, Field
from fastapi import UploadFile
from typing import Optional


class PatientRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)


class PatientUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    phonenumber: Optional[str] = None


class PatientLogin(BaseModel):
    email: EmailStr
    password: str


class PasswordResetRequest(BaseModel):
    email: EmailStr


class OTPVerification(BaseModel):
    email: EmailStr
    otp: int


class PasswordReset(BaseModel):
    email: EmailStr
    new_password: str = Field(..., min_length=8)
    otp: int


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str | None = None
