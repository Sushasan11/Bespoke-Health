from sqlalchemy.orm import Session
from fastapi import HTTPException
from schemas.doctor_schema import DoctorSignup, DoctorLogin, DoctorKYCUpdate
from repositories.doctor_repository import DoctorRepository
from utils.password_utils import hash_password, verify_password, create_access_token
from utils.email_utils import send_email
from datetime import timedelta


class DoctorService:
    # Registers a new doctor
    @staticmethod
    def signup(doctor: DoctorSignup, db: Session):
        if DoctorRepository.get_by_email(db, doctor.email):
            raise HTTPException(status_code=400, detail="Email is already registered")

        hashed_password = hash_password(doctor.password)
        new_doctor = DoctorRepository.create_doctor(db, doctor.email, hashed_password)

        # Send KYC email notification
        email_subject = "Complete Your KYC Verification"
        email_body = """
        Hello,

        Thank you for signing up as a doctor on our platform.

        To access all features, please complete your KYC verification on the website.

        Best regards, 
        Bespoke Health
        """

        html_body = f"""
        <html>
        <body>
        <h3>Complete Your KYC Verification</h3>
        <p>Thank you for signing up as a doctor on Bespoke Health.</p>
        <p>Please <a href="http://localhost:5173/doctor/update-profile">complete your KYC</a> to unlock full access.</p>
        <p>Best regards,<br>Bespoke Health</p>
        </body>
        </html>
        """

        send_email(doctor.email, email_subject, email_body, html_body)

        return new_doctor

    # Logs in a doctor and verifies KYC
    @staticmethod
    def login(doctor: DoctorLogin, db: Session):
        doctor_obj = DoctorRepository.get_by_email(db, doctor.email)
        if not doctor_obj or not verify_password(doctor.password, doctor_obj.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        # Mark doctor as verified upon login
        if not doctor_obj.is_verified:
            doctor_obj.is_verified = True
            db.commit()

        access_token = create_access_token(
            data={"sub": doctor.email},
            expires_delta=12 * 60,  # Convert hours to minutes
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "is_verified": doctor_obj.is_verified,
            "kyc_message": (
                "Please verify your KYC to access all features."
                if not doctor_obj.is_verified
                else None
            ),
        }

    # Updates doctor KYC information
    @staticmethod
    def update_kyc(doctor_data: DoctorKYCUpdate, doctor_id: int, db: Session):
        doctor = DoctorRepository.get_by_id(db, doctor_id)
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor not found")

        doctor.name = doctor_data.name
        doctor.specialization = doctor_data.specialization
        doctor.experience = doctor_data.experience
        doctor.phonenumber = doctor_data.phonenumber
        doctor.address = doctor_data.address
        doctor.qualification = doctor_data.qualification
        doctor.is_verified = False  # Mark as pending for admin approval

        db.commit()
        db.refresh(doctor)

        return {"message": "KYC updated successfully. Awaiting admin verification."}

    # Retrieves doctor profile
    @staticmethod
    def get_doctor(doctor_id: int, db: Session):
        doctor = DoctorRepository.get_by_id(db, doctor_id)
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor not found")

        return {
            "email": doctor.email,
            "name": doctor.name,
            "specialization": doctor.specialization,
            "is_verified": doctor.is_verified,
            "profile_picture": doctor.profilepicture,
        }
