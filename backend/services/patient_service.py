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
    PasswordResetRequest,
    OTPVerifyRequest,
    PasswordChangeRequest,
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

        new_patient = create_patient(db, patient_data)

        # Ensure the function returns a Patient model instance
        if not isinstance(new_patient, Patient):
            raise HTTPException(status_code=500, detail="Error creating patient")

        return new_patient

    # Update patient profile
    @staticmethod
    def update_patient_profile(
        patient: Patient, update_data: PatientUpdateSchema, db: Session
    ):
        return update_patient_profile(db, patient, update_data)

    # Send OTP for password reset
    @staticmethod
    def send_reset_token(request_data: PasswordResetRequest, db: Session):
        patient = get_patient_by_email(db, request_data.email)
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")

        otp = str(random.randint(100000, 999999))
        SessionService.store_otp(request_data.email, otp)
        return {"message": "OTP sent to registered email"}

    # Verify OTP before resetting password
    @staticmethod
    def verify_otp(otp_data: OTPVerifyRequest):
        stored_otp = SessionService.get_otp(otp_data.email)
        if stored_otp and stored_otp == otp_data.otp:
            session_token = SessionService.create_session_token(
                otp_data.email
            )  # Generate session token
            SessionService.delete_otp(otp_data.email)
            return {"session_token": session_token}
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    # Reset password
    @staticmethod
    def reset_password(reset_data: PasswordChangeRequest, db: Session):
        email = SessionService.verify_session_token(reset_data.session_token)
        if not email:
            raise HTTPException(status_code=400, detail="Invalid session token")

        patient = get_patient_by_email(db, email)
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")

        patient.password = hash_password(reset_data.new_password)
        db.commit()
        return {"message": "Password reset successfully"}
