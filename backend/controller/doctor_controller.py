from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from database.database import get_db
from schemas.doctor_schema import DoctorSignup, DoctorLogin
from services.doctor_service import DoctorService

router = APIRouter(tags=["Doctor"])


@router.post("/signup/doctor")
def signup(doctor: DoctorSignup, db: Session = Depends(get_db)):
    return DoctorService.signup(doctor, db)


@router.post("/login/doctor")
def login(doctor: DoctorLogin, db: Session = Depends(get_db)):
    return DoctorService.login(doctor, db)


@router.put("/doctor/update-kyc")
def update_kyc(
    email: str,
    name: str,
    specialization: str,
    experience: int,
    phonenumber: str,
    address: str,
    qualification: str,
    degree: UploadFile = File(...),
    profilepicture: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    return DoctorService.update_kyc(
        email,
        name,
        specialization,
        experience,
        phonenumber,
        address,
        qualification,
        degree,
        profilepicture,
        db,
    )
