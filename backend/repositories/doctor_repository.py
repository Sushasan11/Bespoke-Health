from sqlalchemy.orm import Session
from models.doctor_model import Doctor
from fastapi import HTTPException


class DoctorRepository:

    @staticmethod
    def get_by_email(db: Session, email: str):
        return db.query(Doctor).filter(Doctor.email == email).first()

    @staticmethod
    def create_doctor(db: Session, email: str, hashed_password: str):
        new_doctor = Doctor(email=email, password=hashed_password, is_verified=False)
        db.add(new_doctor)
        db.commit()
        db.refresh(new_doctor)
        return {"message": "Signup successful. Please complete KYC verification."}

    @staticmethod
    def update_kyc(
        db: Session,
        email,
        name,
        specialization,
        experience,
        phonenumber,
        address,
        qualification,
        degree,
        profilepicture,
    ):
        doctor = db.query(Doctor).filter(Doctor.email == email).first()
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor not found")

        doctor.name = name
        doctor.specialization = specialization
        doctor.experience = experience
        doctor.phonenumber = phonenumber
        doctor.address = address
        doctor.qualification = qualification
        doctor.degree = degree.file.read()
        doctor.profilepicture = profilepicture.file.read()
        doctor.is_verified = False  # Awaiting Admin Approval

        db.commit()
        db.refresh(doctor)
        return {"message": "KYC updated successfully. Awaiting admin verification."}
