from sqlalchemy.orm import Session
from repositories.doctor_repository import DoctorRepository
from schemas.doctor_schema import DoctorSignup, DoctorLogin
from utils.password_utils import hash_password, verify_password
from utils.jwt_utils import create_access_token
from datetime import timedelta
from fastapi import HTTPException


class DoctorService:

    @staticmethod
    def signup(doctor: DoctorSignup, db: Session):
        if DoctorRepository.get_by_email(db, doctor.email):
            raise HTTPException(status_code=400, detail="Email is already registered")

        hashed_password = hash_password(doctor.password)
        return DoctorRepository.create_doctor(db, doctor.email, hashed_password)

    @staticmethod
    def login(doctor: DoctorLogin, db: Session):
        doctor_obj = DoctorRepository.get_by_email(db, doctor.email)
        if not doctor_obj or not verify_password(doctor.password, doctor_obj.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        access_token = create_access_token(
            data={"sub": doctor.email}, expires_delta=timedelta(hours=12)
        )
        return {"access_token": access_token, "token_type": "bearer"}

    @staticmethod
    def update_kyc(
        email,
        name,
        specialization,
        experience,
        phonenumber,
        address,
        qualification,
        degree,
        profilepicture,
        db: Session,
    ):
        return DoctorRepository.update_kyc(
            db,
            email,
            name,
            specialization,
            experience,
            phonenumber,
            address,
            qualification,
            degree,
            profilepicture,
        )
