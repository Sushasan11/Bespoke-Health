from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from typing import Dict, Any
from sqlalchemy.orm import Session
from services.patient_service import PatientService
from services.session_service import SessionService
from repositories.patient_repositories import get_patient_by_email
from utils.auth_utils import get_current_patient
from utils.session_utils import (
    remove_session,
    store_otp,
    get_otp,
    delete_otp,
    create_session,
    verify_session_token,
)
from utils.otp_utils import generate_otp
from utils.email_utils import send_otp_email
from utils.password_utils import hash_password
from database.database import get_db
from schemas.patient_schema import (
    PatientSignupSchema,
    PatientLoginSchema,
    PatientUpdateSchema,
    PatientProfileSchema,
    PasswordResetRequest,
    OTPVerifyRequest,
    PasswordChangeRequest,
)
from models.patient_model import Patient

router = APIRouter(prefix="/patient", tags=["Patient"])


# Signup endpoint
@router.post(
    "/signup", status_code=status.HTTP_201_CREATED, response_model=Dict[str, str]
)
async def signup(patient_data: PatientSignupSchema, db: Session = Depends(get_db)):
    if get_patient_by_email(db, patient_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    PatientService.register_patient(patient_data, db)
    return {"message": "Patient registered successfully"}


# Login endpoint
@router.post("/login", response_model=Dict[str, Any])
async def login(
    request: Request,
    response: Response,
    login_data: PatientLoginSchema,
    db: Session = Depends(get_db),
):
    result = SessionService.create_user_session(
        request, login_data.email, login_data.password, "patient", db
    )
    session_token = result["session_token"]

    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        samesite="None",
        secure=True,
        path="/",
        domain="127.0.0.1",
    )

    return result


# Navbar API
@router.get("/navbar")
async def get_patient_navbar(request: Request, db: Session = Depends(get_db)):
    session_token = request.cookies.get("session_token")
    if not session_token:
        raise HTTPException(status_code=401, detail="Session not found")

    # Extract user_id only (ignore role)
    user_id, _ = verify_session_token(session_token)

    patient = db.query(Patient).filter(Patient.user_id == user_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    notifications = []
    if not patient.kyc_verified:
        notifications.append("⚠️ Your KYC is not verified. Please complete it.")

    return {"notifications": notifications}


# Logout endpoint
@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(request: Request, response: Response):
    return remove_session(request, response)


# Get patient profile
@router.get("/me", response_model=PatientProfileSchema)
async def get_patient_profile(request: Request, db: Session = Depends(get_db)):
    return get_current_patient(request, db)


# Update patient profile endpoint
@router.put("/update-profile", response_model=PatientProfileSchema)
async def update_patient_profile(
    update_data: PatientUpdateSchema,
    patient: Patient = Depends(get_current_patient),
    db: Session = Depends(get_db),
):
    return PatientService.update_patient_profile(patient, update_data, db)


# Request password reset
@router.post("/password-reset/request", response_model=Dict[str, str])
async def request_password_reset(
    data: PasswordResetRequest, db: Session = Depends(get_db)
):
    patient = get_patient_by_email(db, data.email)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    otp = generate_otp(data.email)
    store_otp(data.email, otp)

    send_otp_email(data.email, "Password Reset OTP", otp)

    return {"message": "OTP sent to your email"}


# Verify OTP
@router.post("/password-reset/verify", response_model=Dict[str, str])
async def verify_password_otp(data: OTPVerifyRequest):
    stored_otp = get_otp(data.email)

    if not stored_otp or stored_otp != data.otp:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    session_token = create_session(data.email, "patient")
    delete_otp(data.email)

    return {"session_token": session_token}


# Reset password
@router.post("/password-reset/change", response_model=Dict[str, str])
async def reset_password(data: PasswordChangeRequest, db: Session = Depends(get_db)):
    # Verify session token and get email
    email = verify_session_token(data.session_token)

    if not email:
        raise HTTPException(
            status_code=400, detail="Invalid session token or session expired"
        )

    # Fetch patient by email
    patient = get_patient_by_email(db, email)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Hash new password and update the database
    hashed_password = hash_password(data.new_password)
    patient.password = hashed_password

    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    return {"message": "Password has been reset successfully"}


# Session verification endpoint
@router.get("/session")
async def check_session(request: Request):
    session_token = request.cookies.get("session_token")
    if not session_token or not verify_session_token(session_token):
        raise HTTPException(status_code=401, detail="Session not found or expired")
    return {"session_token": session_token}
