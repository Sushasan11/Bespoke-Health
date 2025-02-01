from sqlalchemy.orm import Session
from fastapi import HTTPException
from schemas.patient_schema import PatientRegister, PatientUpdate, PatientLogin
from repositories.patient_repository import (
    get_patient_by_email,
    create_patient,
    update_patient,
)
from models.patient_model import Patient  # Import Patient model
from utils.password_utils import hash_password, verify_password, create_access_token
from utils.otp_utils import send_otp, verify_otp, delete_otp


# Patient Signup Service
def register_patient_service(patient: PatientRegister, db: Session):
    # Check if patient already exists
    existing_patient = get_patient_by_email(db, patient.email)
    if existing_patient:
        raise HTTPException(status_code=400, detail="Email is already registered")

    # Hash the password before storing
    hashed_password = hash_password(patient.password)

    # Create new patient record
    return create_patient(db, patient.email, hashed_password)


# Patient Login Service
def login_patient_service(patient: PatientLogin, db: Session):
    # Fetch patient by email
    user = get_patient_by_email(db, patient.email)

    # Validate credentials
    if not user or not verify_password(patient.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Generate JWT token
    access_token = create_access_token({"sub": user.email})

    return {"access_token": access_token, "token_type": "bearer"}


# Update Patient Profile
def update_profile_service(patient_id: int, patient_data: PatientUpdate, db: Session):
    # Update patient details in database
    return update_patient(db, patient_id, patient_data)


# Get Patient Info
def get_patient_service(patient_id: int, db: Session):
    # Fetch patient details by ID
    patient = db.query(Patient).filter(Patient.id == patient_id).first()

    # Check if patient exists
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    return patient


# Request OTP for Password Reset
def request_password_reset_service(email: str, db: Session):
    # Check if patient exists
    patient = get_patient_by_email(db, email)
    if not patient:
        raise HTTPException(status_code=404, detail="User not found")

    # Send OTP to patient's email
    send_otp(email)

    return {"message": "OTP sent"}


# Verify OTP
def verify_password_reset_otp_service(email: str, otp: int):
    # Check if OTP is valid
    if not verify_otp(email, otp):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    return {"message": "OTP verified"}


# Reset Password
def reset_password_service(email: str, new_password: str, otp: int, db: Session):
    # Fetch patient by email
    patient = get_patient_by_email(db, email)

    # Validate OTP before resetting password
    if not patient or not verify_otp(email, otp):
        raise HTTPException(status_code=400, detail="Invalid OTP")

    # Hash new password
    patient.password = hash_password(new_password)

    # Save updated password in database
    db.commit()

    # Delete OTP after successful password reset
    delete_otp(email)

    return {"message": "Password reset successfully"}
