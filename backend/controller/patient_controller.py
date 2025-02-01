from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from schemas.patient_schema import PatientRegister, PatientLogin, PatientUpdate
from services.patient_service import (
    register_patient_service,
    login_patient_service,
    update_profile_service,
    get_patient_service,
    request_password_reset_service,
    verify_password_reset_otp_service,
    reset_password_service,
)
from utils.password_utils import get_current_user_id

router = APIRouter()


# Patient Signup
@router.post("/signup/patient/")
def register_patient(patient: PatientRegister, db: Session = Depends(get_db)):
    return register_patient_service(patient, db)


# Patient Login (JWT Token)
@router.post("/login/")
def login(patient: PatientLogin, db: Session = Depends(get_db)):
    return login_patient_service(patient, db)


# Update Profile (Authenticated)
@router.put("/update-profile/")
def update_profile(
    patient_data: PatientUpdate,
    db: Session = Depends(get_db),
    patient_id: int = Depends(get_current_user_id),
):
    return update_profile_service(patient_id, patient_data, db)


# Get Current Patient
@router.get("/me/")
def get_current_user(
    db: Session = Depends(get_db), patient_id: int = Depends(get_current_user_id)
):
    return get_patient_service(patient_id, db)


# Request OTP for Password Reset
@router.post("/request-password-reset/")
def request_password_reset(email: str, db: Session = Depends(get_db)):
    return request_password_reset_service(email, db)


# Verify OTP for Password Reset
@router.post("/verify-password-reset-otp/")
def verify_password_reset_otp(email: str, otp: int):
    return verify_password_reset_otp_service(email, otp)


# Reset Password
@router.post("/reset-password/")
def reset_password(
    email: str, new_password: str, otp: int, db: Session = Depends(get_db)
):
    return reset_password_service(email, new_password, otp, db)
