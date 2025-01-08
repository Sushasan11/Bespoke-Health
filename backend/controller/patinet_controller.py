from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.patient_model import Patient
from database.database import get_db
from models.patient_model import Patient
from database.schemas import (
    PatientRegister,
    PatientLogin,
    PasswordResetRequest,
    OTPVerification,
    PasswordReset,
)
from utils.password_utils import hash_password, verify_password
from utils.otp_utils import otp_storage, delete_otp, is_otp_expired
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


# Patient Signup
@router.post("/signup/patient/")
def register_patient(patient: PatientRegister, db: Session = Depends(get_db)):
    existing_patient = db.query(Patient).filter(Patient.email == patient.email).first()
    if existing_patient:
        raise HTTPException(status_code=400, detail="Email is already registered")

    hashed_password = hash_password(patient.password)

    # Create the new patient record
    new_patient = Patient(
        email=patient.email,
        password=hashed_password,
        name=patient.name,
        age=patient.age,
        gender=patient.gender,
        address=patient.address,
        phonenumber=patient.phonenumber,
    )

    # Add the patient to the database
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)

    logger.info(f"Patient registered successfully: {patient.email}")

    return {"message": "Patient registered successfully"}


# Patient Login
@router.post("/login/")
def login(patient: PatientLogin, db: Session = Depends(get_db)):
    existing_user = db.query(Patient).filter(Patient.email == patient.email).first()

    if not existing_user:
        raise HTTPException(status_code=401, detail="Invalid email")

    if not verify_password(patient.password, existing_user.password):
        raise HTTPException(status_code=401, detail="Invalid password")

    logger.info(f"User logged in: {patient.email}")

    return {
        "message": "Login successful",
        "user_id": existing_user.id,
    }


# Request password reset
@router.post("/request/otp/")
def request_password_reset(
    request: PasswordResetRequest, db: Session = Depends(get_db)
):
    patient = db.query(Patient).filter(Patient.email == request.email).first()
    if not patient:
        raise HTTPException(status_code=404, detail="User not found")

    logger.info(f"OTP sent for password reset to: {request.email}")
    return {"message": "OTP sent to your mail"}


# Verify OTP for password reset
@router.post("/verify-otp/")
def verify_otp(otp_verification: OTPVerification):
    if otp_verification.email not in otp_storage or is_otp_expired(
        otp_verification.email
    ):
        raise HTTPException(status_code=400, detail="OTP not sent or expired")

    if otp_storage[otp_verification.email] != otp_verification.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    logger.info(f"OTP verified for: {otp_verification.email}")
    return {"message": "OTP verified successfully"}


# Reset password
@router.post("/reset-password/")
def reset_password(reset_info: PasswordReset, db: Session = Depends(get_db)):
    user = db.query(Patient).filter(Patient.email == reset_info.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if reset_info.otp != otp_storage.get(reset_info.email):
        raise HTTPException(status_code=400, detail="Invalid OTP")

    user.password = hash_password(reset_info.new_password)
    db.commit()
    logger.info(f"Password reset for: {reset_info.email}")

    # Clean up OTP
    delete_otp(reset_info.email)

    return {"message": "Password reset successfully"}
