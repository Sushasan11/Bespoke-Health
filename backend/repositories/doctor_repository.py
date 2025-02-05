from sqlalchemy.orm import Session
from models.doctor_model import Doctor
from fastapi import HTTPException


class DoctorRepository:

    @staticmethod
    def get_by_email(db: Session, email: str):
        return db.query(Doctor).filter(Doctor.email == email).first()

    @staticmethod
    def get_by_id(db: Session, doctor_id: int):
        return db.query(Doctor).filter(Doctor.id == doctor_id).first()

    @staticmethod
    def create_doctor(db: Session, email: str, hashed_password: str):
        new_doctor = Doctor(email=email, password=hashed_password, is_verified=False)
        db.add(new_doctor)
        db.commit()
        db.refresh(new_doctor)
        return {"message": "Signup successful. Please complete KYC verification."}

    @staticmethod
    def update_kyc(db: Session, email: str, doctor_data):
        doctor = db.query(Doctor).filter(Doctor.email == email).first()
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor not found")

        doctor.name = doctor_data.name
        doctor.specialization = doctor_data.specialization
        doctor.experience = doctor_data.experience
        doctor.phonenumber = doctor_data.phonenumber
        doctor.address = doctor_data.address
        doctor.qualification = doctor_data.qualification
        doctor.profilepicture = doctor_data.profilepicture
        doctor.degree = doctor_data.degree
        doctor.is_verified = False  # Admin must approve

        db.commit()
        db.refresh(doctor)
        return {"message": "KYC updated successfully. Awaiting admin verification."}
