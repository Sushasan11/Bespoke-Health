from pydantic import BaseModel, EmailStr, constr
from fastapi import UploadFile
from typing import List, Optional
from datetime import datetime

PasswordStr = constr(min_length=8)


class PatientRegister(BaseModel):
    email: EmailStr
    password: PasswordStr
    name: str
    age: int
    gender: str
    address: str
    phonenumber: str


class DoctorRegister(BaseModel):
    email: EmailStr
    password: PasswordStr
    name: str
    specialization: str
    qualification: str
    experience: int
    phonenumber: str
    address: str
    degree: UploadFile
    profilepicture: UploadFile


class PatientLogin(BaseModel):
    email: EmailStr
    password: str


class DoctorLogin(BaseModel):
    email: EmailStr
    password: str


class PasswordResetRequest(BaseModel):
    email: EmailStr


class OTPVerification(BaseModel):
    email: EmailStr
    otp: int


class PasswordReset(BaseModel):
    email: EmailStr
    new_password: PasswordStr
    otp: int


class AdminLogin(BaseModel):
    email: EmailStr
    password: str
