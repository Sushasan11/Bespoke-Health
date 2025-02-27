import os
from fastapi import (
    APIRouter,
    HTTPException,
    Depends,
    Request,
    Response,
    UploadFile,
    File,
    Form,
    status,
)
from sqlalchemy.orm import Session
from schemas.doctor_schema import (
    DoctorSignupSchema,
    DoctorLoginSchema,
    DoctorProfileSchema,
    DoctorUpdateSchema,
)
from services.doctor_service import register_doctor, update_doctor_profile
from database.database import get_db
from models.user_model import User
from models.doctor_model import Doctor
from utils.hash_password import verify_password
from services.session_service import SessionService

router = APIRouter(prefix="/doctor", tags=["Doctor"])

# Directories for file uploads
PROFILE_UPLOAD_DIR = "uploads/profile_pictures"
CERTIFICATE_UPLOAD_DIR = "uploads/degree_certificates"

os.makedirs(PROFILE_UPLOAD_DIR, exist_ok=True)
os.makedirs(CERTIFICATE_UPLOAD_DIR, exist_ok=True)


@router.post("/signup", status_code=201)
async def signup(
    email: str = Form(...),
    password: str = Form(...),
    name: str = Form(...),
    department_id: int = Form(...),
    experience: int = Form(...),
    phonenumber: str = Form(...),
    address: str = Form(...),
    qualification: str = Form(...),
    profile_picture: UploadFile = File(...),
    degree_certificate: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    try:
        doctor_data = DoctorSignupSchema(
            email=email,
            password=password,
            name=name,
            department_id=department_id,
            experience=experience,
            phonenumber=phonenumber,
            address=address,
            qualification=qualification,
        )
        return await register_doctor(
            db, doctor_data, profile_picture, degree_certificate
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/login", status_code=200)
def login(
    request: Request,
    response: Response,
    login_data: DoctorLoginSchema,
    db: Session = Depends(get_db),
):
    # Query for a doctor with the given email and role "doctor"
    doctor_user = (
        db.query(User)
        .filter(User.email == login_data.email, User.role == "doctor")
        .first()
    )
    if not doctor_user or not verify_password(
        login_data.password, doctor_user.password
    ):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Create a session for the doctor
    result = SessionService.create_user_session(
        request, login_data.email, login_data.password, "doctor", db
    )
    session_token = result["session_token"]
    response.set_cookie(key="session_token", value=session_token, httponly=True)
    return {"message": "Login successful", "session_token": session_token}


# Dependency to get the current doctor from session
def get_current_doctor(request: Request, db: Session = Depends(get_db)):
    token = request.headers.get("session_token")
    if not token or not token.strip():
        token = request.cookies.get("session_token")
    if not token:
        raise HTTPException(status_code=401, detail="Session not found")
    user_id, role = SessionService.get_session_user_from_token(token)
    if role != "doctor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized access"
        )
    doctor = db.query(Doctor).filter(Doctor.user_id == user_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor


@router.get("/me", response_model=DoctorProfileSchema)
def get_doctor_profile(request: Request, db: Session = Depends(get_db)):
    doctor = get_current_doctor(request, db)
    return doctor


@router.put("/update-profile", response_model=DoctorProfileSchema)
def update_profile(
    update_data: DoctorUpdateSchema,
    doctor: Doctor = Depends(get_current_doctor),
    db: Session = Depends(get_db),
):
    updated_doctor = update_doctor_profile(doctor, update_data, db)
    return updated_doctor
