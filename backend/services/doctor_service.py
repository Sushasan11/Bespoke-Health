from sqlalchemy.orm import Session
from fastapi import HTTPException, UploadFile
from schemas.doctor_schema import DoctorLogin
from repositories.doctor_repository import DoctorRepository
from utils.password_utils import hash_password, verify_password, create_access_token
from utils.email_utils import send_email
from datetime import timedelta
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


class DoctorService:
    @staticmethod
    async def signup(
        email: str,
        password: str,
        name: str,
        specialization: str,
        experience: int,
        phonenumber: str,
        address: str,
        qualification: str,
        profile_picture: UploadFile,
        degree: UploadFile,
        db: Session,
    ):
        # Registers a new doctor and saves profile picture & degree as binary data
        if DoctorRepository.get_by_email(db, email):
            raise HTTPException(status_code=400, detail="Email already registered")

        hashed_password = hash_password(password)

        # Read files as binary
        degree_binary = await degree.read()
        profile_picture_binary = await profile_picture.read()

        new_doctor = DoctorRepository.create_doctor(
            db,
            email,
            hashed_password,
            name,
            specialization,
            experience,
            phonenumber,
            address,
            qualification,
            degree_binary,
            profile_picture_binary,
        )

        # Send email notification
        send_email(
            email,
            "KYC Verification in Progress",
            "KYC Verification in Progress",
            """
            <html>
            <body style="background-color:#f4f4f4; padding:20px; font-family:Arial, sans-serif;">
                <div style="max-width:600px; margin:auto; background:#ffffff; padding:20px; border-radius:10px; box-shadow:0px 0px 10px rgba(0,0,0,0.1);">
                    <h2 style="color:#007bff; text-align:center;">KYC Verification in Progress</h2>
                    <p style="color:#333; font-size:16px; text-align:center;">
                        Thank you for submitting your KYC details. Our team is reviewing your documents.
                    </p>
                    <div style="text-align:center; margin:20px 0;">
                        <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" width="80" height="80">
                    </div>
                    <p style="color:#555; font-size:14px; text-align:center;">
                        This process may take some time. Once your verification is complete, you will receive a confirmation email.
                    </p>
                    <div style="text-align:center; margin-top:20px;">
                        <a href="http://localhost:5173/login/doctor" style="background-color:#007bff; color:#ffffff; padding:10px 20px; text-decoration:none; border-radius:5px; display:inline-block;">
                            Login to Your Account
                        </a>
                    </div>
                    <p style="color:#888; font-size:12px; text-align:center; margin-top:20px;">
                        If you have any questions, please contact our support team.
                    </p>
                </div>
            </body>
            </html>
            """,
        )

        return new_doctor

    @staticmethod
    async def update_kyc(
        name: str = None,
        specialization: str = None,
        experience: int = None,
        phonenumber: str = None,
        address: str = None,
        qualification: str = None,
        profile_picture: UploadFile = None,
        degree: UploadFile = None,
        doctor_id: int = None,
        db: Session = None,
    ):
        # Updates doctor KYC details, including profile picture and degree
        doctor = DoctorRepository.get_by_id(db, doctor_id)
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor not found")

        profile_picture_binary = (
            await profile_picture.read() if profile_picture else doctor.profilepicture
        )
        degree_binary = await degree.read() if degree else doctor.degree

        return DoctorRepository.update_kyc(
            db,
            doctor_id,
            name,
            specialization,
            experience,
            phonenumber,
            address,
            qualification,
            degree_binary,
            profile_picture_binary,
        )

    @staticmethod
    def login(doctor: DoctorLogin, db: Session):
        # Handles doctor login and returns a JWT token
        doctor_obj = DoctorRepository.get_by_email(db, doctor.email)

        if not doctor_obj or not verify_password(doctor.password, doctor_obj.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        access_token = create_access_token(
            data={"sub": doctor.email}, expires_delta=timedelta(hours=12)
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "kyc_status": doctor_obj.kyc_status,
        }
