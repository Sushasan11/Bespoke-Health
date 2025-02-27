from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import random
from models.patient_model import Patient
from repositories.patient_repositories import (
    get_patient_by_email,
    create_patient,
    update_patient_profile,
)
from schemas.patient_schema import (
    PatientSignupSchema,
    PatientUpdateSchema,
    PasswordResetRequestSchema,
    OTPVerificationSchema,
    PasswordResetSchema,
)
from utils.hash_password import hash_password
from services.session_service import SessionService


class PatientService:

    # Register a new patient
    @staticmethod
    def register_patient(patient_data: PatientSignupSchema, db: Session):
        if get_patient_by_email(db, patient_data.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )
        return create_patient(db, patient_data)

    # Update patient profile
    @staticmethod
    def update_patient_profile(
        patient: Patient, update_data: PatientUpdateSchema, db: Session
    ):
        return update_patient_profile(db, patient, update_data)

    # Send OTP for password reset (Uses PasswordResetRequestSchema)
    @staticmethod
    def send_reset_token(request_data: PasswordResetRequestSchema, db: Session):
        patient = get_patient_by_email(db, request_data.email)
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")

        otp = str(random.randint(100000, 999999))
        SessionService.store_otp(request_data.email, otp)
        return {"message": "OTP sent to registered email"}

    # Verify OTP before resetting password (Uses OTPVerificationSchema)
    @staticmethod
    def verify_token(otp_data: OTPVerificationSchema):
        stored_otp = SessionService.get_otp(otp_data.email)
        if stored_otp and stored_otp == otp_data.otp:
            return {"valid": True}
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    # Reset password
    @staticmethod
    def reset_password(reset_data: PasswordResetSchema, db: Session):
        patient = get_patient_by_email(db, reset_data.email)
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")

        if SessionService.get_otp(reset_data.email) != reset_data.otp:
            raise HTTPException(status_code=400, detail="Invalid OTP")

        patient.password = hash_password(reset_data.new_password)
        db.commit()
        SessionService.delete_otp(reset_data.email)
        return {"message": "Password reset successfully"}
