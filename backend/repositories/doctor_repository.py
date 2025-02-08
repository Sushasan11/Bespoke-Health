from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.doctor_model import Doctor


class DoctorRepository:
    @staticmethod
    def get_by_email(db: Session, email: str):
        # Retrieve a doctor by email
        return db.query(Doctor).filter(Doctor.email == email).first()

    @staticmethod
    def get_by_id(db: Session, doctor_id: int):
        # Retrieve a doctor by ID
        return db.query(Doctor).filter(Doctor.id == doctor_id).first()

    @staticmethod
    def create_doctor(
        db: Session,
        email: str,
        hashed_password: str,
        name: str,
        specialization: str,
        experience: int,
        phonenumber: str,
        address: str,
        qualification: str,
        degree: bytes,
        profile_picture: bytes,
    ):
        # Create a new doctor record in the database with binary file storage
        new_doctor = Doctor(
            email=email,
            password=hashed_password,
            name=name,
            specialization=specialization,
            experience=experience,
            phonenumber=phonenumber,
            address=address,
            qualification=qualification,
            profilepicture=profile_picture,
            degree=degree,
            kyc_status="pending",
            is_verified=False,
        )
        db.add(new_doctor)
        db.commit()
        db.refresh(new_doctor)
        return {"message": "Signup successful. KYC verification pending."}

    @staticmethod
    def update_kyc(
        db: Session,
        doctor_id: int,
        name: str = None,
        specialization: str = None,
        experience: int = None,
        phonenumber: str = None,
        address: str = None,
        qualification: str = None,
        degree: bytes = None,
        profile_picture: bytes = None,
    ):
        # Update doctor KYC details, including profile picture and degree
        doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor not found")

        if name:
            doctor.name = name
        if specialization:
            doctor.specialization = specialization
        if experience is not None:
            doctor.experience = experience
        if phonenumber:
            doctor.phonenumber = phonenumber
        if address:
            doctor.address = address
        if qualification:
            doctor.qualification = qualification
        if profile_picture:
            doctor.profilepicture = profile_picture
        if degree:
            doctor.degree = degree

        doctor.kyc_status = "pending"
        doctor.is_verified = False

        db.commit()
        db.refresh(doctor)
        return {"message": "KYC updated successfully. Awaiting admin verification."}

    @staticmethod
    def approve_kyc(db: Session, doctor_id: int, status: str):
        # Approve or reject KYC verification
        doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor not found")

        if status not in ["approved", "rejected"]:
            raise HTTPException(status_code=400, detail="Invalid status")

        doctor.kyc_status = status
        doctor.is_verified = True if status == "approved" else False

        db.commit()
        db.refresh(doctor)
        return {"message": f"KYC verification {status}."}
