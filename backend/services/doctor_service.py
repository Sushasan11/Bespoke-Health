import os
from sqlalchemy.orm import Session
from fastapi import UploadFile, HTTPException
from models.doctor_model import Doctor
from models.user_model import User
from models.department_model import Department
from schemas.doctor_schema import (
    DoctorSignupSchema,
    DoctorUpdateSchema,
    DoctorSignupForm,
    DoctorLoginSchema,
    DoctorProfileSchema,
)
from utils.hash_password import hash_password

# Directories for file uploads
PROFILE_UPLOAD_DIR = "uploads/profile_pictures"
CERTIFICATE_UPLOAD_DIR = "uploads/degree_certificates"

os.makedirs(PROFILE_UPLOAD_DIR, exist_ok=True)
os.makedirs(CERTIFICATE_UPLOAD_DIR, exist_ok=True)


def save_uploaded_file(upload_dir: str, file: UploadFile) -> str:
    # Saves uploaded file and returns the file path
    file_path = os.path.join(upload_dir, file.filename)
    with open(file_path, "wb") as f:
        f.write(file.file.read())
    return file_path


async def register_doctor(
    db: Session,
    doctor_data: DoctorSignupSchema,
    profile_picture: UploadFile,
    degree_certificate: UploadFile,
):
    # Check if a user with this email already exists
    existing_user = db.query(User).filter(User.email == doctor_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered.")

    hashed_password = hash_password(doctor_data.password)

    # Create the user record for the doctor
    new_user = User(email=doctor_data.email, password=hashed_password, role="doctor")
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Save uploaded files
    profile_picture_path = save_uploaded_file(PROFILE_UPLOAD_DIR, profile_picture)
    degree_certificate_path = save_uploaded_file(
        CERTIFICATE_UPLOAD_DIR, degree_certificate
    )

    # Create the doctor record and explicitly set kyc_status to "pending"
    new_doctor = Doctor(
        user_id=new_user.id,
        email=doctor_data.email,
        name=doctor_data.name,
        department_id=doctor_data.department_id,
        experience=doctor_data.experience,
        phonenumber=doctor_data.phonenumber,
        address=doctor_data.address,
        qualification=doctor_data.qualification,
        profile_picture_url=profile_picture_path,
        degree_certificate_url=degree_certificate_path,
        kyc_status="pending",  # Explicitly set kyc_status
    )

    db.add(new_doctor)
    db.commit()
    db.refresh(new_doctor)

    return {
        "id": new_doctor.id,
        "email": new_doctor.email,
        "user_id": new_doctor.user_id,
        "profile_picture_url": new_doctor.profile_picture_url,
        "degree_certificate_url": new_doctor.degree_certificate_url,
    }


def update_doctor_profile(doctor: Doctor, update_data: DoctorUpdateSchema, db: Session):
    try:
        update_fields = update_data.dict(exclude_unset=True)
        for field, value in update_fields.items():
            setattr(doctor, field, value)
        db.commit()
        db.refresh(doctor)
        return doctor
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
