from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from database.database import get_db
from schemas.doctor_schema import DoctorSignup, DoctorLogin, DoctorKYCUpdate
from services.doctor_service import DoctorService
from utils.password_utils import get_current_user_id
from repositories.doctor_repository import DoctorRepository

router = APIRouter(tags=["Doctor"])

#Signup Doctor
@router.post("/signup/doctor")
def signup(doctor: DoctorSignup, db: Session = Depends(get_db)):
    return DoctorService.signup(doctor, db)

#Login Doctor
@router.post("/login/doctor")
def login(doctor: DoctorLogin, db: Session = Depends(get_db)):
    return DoctorService.login(doctor, db)

#Kyc Update
@router.put("/doctor/update-kyc")
def update_kyc(
    doctor_data: DoctorKYCUpdate,
    db: Session = Depends(get_db),
    doctor_id: int = Depends(get_current_user_id),
):
    return DoctorService.update_kyc(doctor_data, doctor_id, db)


@router.get("/doctor/me/")
def get_current_doctor(
    db: Session = Depends(get_db), doctor_id: int = Depends(get_current_user_id)
):
    doctor = DoctorRepository.get_by_id(db, doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    return {
        "email": doctor.email,
        "name": doctor.name,
        "specialization": doctor.specialization,
        "experience": doctor.experience,
        "phonenumber": doctor.phonenumber,
        "address": doctor.address,
        "qualification": doctor.qualification,
        "is_verified": doctor.is_verified,
        "profile_picture": doctor.profilepicture,
    }
