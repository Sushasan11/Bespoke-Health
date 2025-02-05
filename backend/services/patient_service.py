import asyncio
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


# Register a new patient
def register_patient_service(patient: PatientRegister, db: Session):
    # Convert email to lowercase for consistency
    email_lower = patient.email.lower()

    # Check if the email is already registered
    if get_patient_by_email(db, email_lower):
        raise HTTPException(status_code=400, detail="Email is already registered")

    # Hash the password securely
    hashed_password = hash_password(patient.password)

    # Create a new patient record in the database
    return create_patient(db, email_lower, hashed_password)


# Login a patient
def login_patient_service(patient: PatientLogin, db: Session):
    # Convert email to lowercase for consistency
    email_lower = patient.email.lower()

    # Retrieve patient data from the database
    user = get_patient_by_email(db, email_lower)

    # Validate user credentials
    if not user or not verify_password(patient.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Generate access token for authentication
    access_token = create_access_token({"sub": user.email})

    # Check if patient has updated their profile (KYC)
    kyc_message = (
        "Please verify your KYC to access all features." if not user.name else None
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "kyc_message": kyc_message,
    }


# Update patient profile
def update_profile_service(patient_id: int, patient_data: PatientUpdate, db: Session):
    # Fetch patient details from the database
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Filter out empty values before updating
    updated_fields = {key: value for key, value in patient_data.dict().items() if value}
    if not updated_fields:
        raise HTTPException(
            status_code=400, detail="No valid fields provided for update"
        )

    # Apply updates
    for key, value in updated_fields.items():
        setattr(patient, key, value)

    # Save changes
    db.commit()
    db.refresh(patient)

    # Check if patient has completed KYC (if name is now set)
    kyc_completed = bool(patient.name)  # True if name is set

    return {"message": "Profile updated successfully", "kyc_completed": kyc_completed}


# Request OTP for Password Reset
async def request_password_reset_service(request: PasswordResetRequest, db: Session):
    # Convert email to lowercase
    email_lower = request.email.lower()

    # Fetch patient details
    patient = get_patient_by_email(db, email_lower)
    if not patient:
        raise HTTPException(status_code=404, detail="User not found")

    from utils.otp_utils import send_otp

    # Send OTP to the patient's email
    otp = await send_otp(email_lower)

    # Return success message if OTP was sent successfully
    if otp is not None:
        return {"message": "OTP sent successfully"}
    else:
        raise HTTPException(
            status_code=400, detail="Failed to send OTP. Please try again later."
        )


# Verify OTP
def verify_password_reset_otp_service(email: str, otp: int):
    from utils.otp_utils import verify_otp

    # Convert email to lowercase for consistency
    email_lower = email.lower()

    # Verify OTP from storage
    if not verify_otp(email_lower, otp):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    return {"message": "OTP verified"}


# Reset Password
def reset_password_service(email: str, new_password: str, otp: int, db: Session):
    from utils.otp_utils import verify_otp, delete_otp

    # Convert email to lowercase for consistency
    email_lower = email.lower()

    # Retrieve patient details
    patient = get_patient_by_email(db, email_lower)

    # Validate OTP and user existence
    if not patient or not verify_otp(email_lower, otp):
        raise HTTPException(status_code=400, detail="Invalid OTP or user not found")

    # Hash new password and update the record
    patient.password = hash_password(new_password)
    db.commit()

    # Delete OTP after successful password reset
    delete_otp(email_lower)

    return {"message": "Password reset successfully"}


# Get Patient Info
def get_patient_service(patient_id: int, db: Session):
    # Fetch patient details
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


# Google OAuth Patient Signup Service
def google_signup_service(user_info: dict, db: Session):
    # Verify if the patient exists
    patient = get_patient_by_email(db, user_info["email"])

    # Create new patient if not found
    if not patient:
        patient = create_patient(db, user_info["email"], None)

    # Generate access token for authentication
    access_token = create_access_token(data={"sub": patient.email})

    # Check if patient has updated their profile (KYC)
    kyc_message = (
        "Please verify your KYC to access all features." if not patient.name else None
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "kyc_message": kyc_message,
    }
