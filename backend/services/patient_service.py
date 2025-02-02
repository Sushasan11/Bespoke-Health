from sqlalchemy.orm import Session
from fastapi import HTTPException
from schemas.patient_schema import (
    PatientRegister,
    PatientUpdate,
    PatientLogin,
    PasswordResetRequest,
)
from repositories.patient_repository import (
    get_patient_by_email,
    create_patient,
    update_patient,
)
from models.patient_model import Patient
from utils.password_utils import hash_password, verify_password, create_access_token
from utils.otp_utils import send_otp, verify_otp, delete_otp


# Patient Signup Service
def register_patient_service(patient: PatientRegister, db: Session):
    email_lower = patient.email.lower()

    # Check if email already exists
    if get_patient_by_email(db, email_lower):
        raise HTTPException(status_code=400, detail="Email is already registered")

    # Create patient with hashed password
    hashed_password = hash_password(patient.password)
    return create_patient(db, email_lower, hashed_password)


# Patient Login Service
def login_patient_service(patient: PatientLogin, db: Session):
    email_lower = patient.email.lower()
    user = get_patient_by_email(db, email_lower)

    if not user or not verify_password(patient.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token({"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


# Update Patient Profile
def update_profile_service(patient_id: int, patient_data: PatientUpdate, db: Session):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    updated_fields = {key: value for key, value in patient_data.dict().items() if value}
    if not updated_fields:
        raise HTTPException(
            status_code=400, detail="No valid fields provided for update"
        )

    for key, value in updated_fields.items():
        setattr(patient, key, value)

    db.commit()
    db.refresh(patient)
    return patient


# Request OTP for Password Reset (Fix for 422)
def request_password_reset_service(request: PasswordResetRequest, db: Session):
    email_lower = request.email.lower()
    patient = get_patient_by_email(db, email_lower)
    if not patient:
        raise HTTPException(status_code=404, detail="User not found")

    send_otp(email_lower)
    return {"message": "OTP sent"}


# Verify OTP
def verify_password_reset_otp_service(email: str, otp: int):
    email_lower = email.lower()
    if not verify_otp(email_lower, otp):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    return {"message": "OTP verified"}


# Reset Password
def reset_password_service(email: str, new_password: str, otp: int, db: Session):
    email_lower = email.lower()
    patient = get_patient_by_email(db, email_lower)

    if not patient or not verify_otp(email_lower, otp):
        raise HTTPException(status_code=400, detail="Invalid OTP or user not found")

    patient.password = hash_password(new_password)
    db.commit()
    delete_otp(email_lower)

    return {"message": "Password reset successfully"}


# Get Patient Info
def get_patient_service(patient_id: int, db: Session):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient
