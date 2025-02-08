from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Request
from sqlalchemy.orm import Session
from database.database import get_db
from schemas.doctor_schema import DoctorLogin
from services.doctor_service import DoctorService
from utils.password_utils import get_current_user_id
from models.notification_model import Notification
import logging

# Logging setup for debugging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter(tags=["Doctor"])


# Doctor signup endpoint
@router.post("/signup/doctor")
async def signup(
    request: Request,
    email: str = Form(...),
    password: str = Form(...),
    name: str = Form(...),
    specialization: str = Form(...),
    experience: str = Form(...),  # Accepts as string, converts to int later
    phonenumber: str = Form(...),
    address: str = Form(...),
    qualification: str = Form(...),
    profile_picture: UploadFile = File(...),
    degree: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    try:
        # Log incoming request
        form_data = await request.form()
        form_data_dict = {key: value for key, value in form_data.items()}
        logger.debug(f"Received Form Data: {form_data_dict}")
        logger.debug(
            f"Files Received: profile_picture: {profile_picture.filename}, degree: {degree.filename}"
        )

        # Convert `experience` to integer to avoid 422 errors
        try:
            experience = int(experience)
        except ValueError:
            raise HTTPException(
                status_code=400, detail="Experience must be a valid integer."
            )

        return await DoctorService.signup(
            email,
            password,
            name,
            specialization,
            experience,
            phonenumber,
            address,
            qualification,
            profile_picture,
            degree,
            db,
        )

    except Exception as e:
        logger.error(f"Error in Doctor Signup: {e}")
        raise HTTPException(status_code=400, detail=str(e))


# Doctor login endpoint
@router.post("/login/doctor")
def login(doctor: DoctorLogin, db: Session = Depends(get_db)):
    return DoctorService.login(doctor, db)


# Update doctor KYC details
@router.put("/doctor/update-kyc")
async def update_kyc(
    name: str = Form(...),
    specialization: str = Form(...),
    experience: str = Form(...),  # Accepts as string, converts to int later
    phonenumber: str = Form(...),
    address: str = Form(...),
    qualification: str = Form(...),
    profile_picture: UploadFile = File(None),
    degree: UploadFile = File(None),
    db: Session = Depends(get_db),
    doctor_id: int = Depends(get_current_user_id),
):
    try:
        # Convert `experience` to integer
        experience = int(experience)

        return await DoctorService.update_kyc(
            name,
            specialization,
            experience,
            phonenumber,
            address,
            qualification,
            profile_picture,
            degree,
            doctor_id,
            db,
        )
    except ValueError:
        raise HTTPException(
            status_code=400, detail="Experience must be a valid integer."
        )


# Get doctor profile
@router.get("/doctor/me/")
def get_current_doctor(
    db: Session = Depends(get_db), doctor_id: int = Depends(get_current_user_id)
):
    doctor = DoctorService.get_doctor(doctor_id, db)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor
