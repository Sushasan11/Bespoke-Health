from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database.database import get_db
from schemas.patient_schema import (
    PatientRegister,
    PatientLogin,
    PatientUpdate,
    PasswordResetRequest,
    OTPVerification,
    PasswordReset,
)
from services.patient_service import (
    register_patient_service,
    login_patient_service,
    update_profile_service,
    get_patient_service,
    request_password_reset_service,
    verify_password_reset_otp_service,
    reset_password_service,
    google_signup_service,
)
from utils.password_utils import get_current_user_id
from utils.google_auth_utils import verify_google_token

router = APIRouter(tags=["Patient"])


# Define request model for Google Sign-In
class GoogleAuthRequest(BaseModel):
    token: str


# Registers a new patient
@router.post("/signup/patient/")
def register_patient(patient: PatientRegister, db: Session = Depends(get_db)):
    return register_patient_service(patient, db)


# Logs in the patient and returns an access token
@router.post("/login/")
def login(patient: PatientLogin, db: Session = Depends(get_db)):
    return login_patient_service(patient, db)


# Updates the patient profile information
@router.put("/update-profile/")
def update_profile(
    patient_data: PatientUpdate,
    db: Session = Depends(get_db),
    patient_id: int = Depends(get_current_user_id),
):
    return update_profile_service(patient_id, patient_data, db)


# Retrieves the logged-in patient's profile details
@router.get("/me/")
def get_current_user(
    db: Session = Depends(get_db), patient_id: int = Depends(get_current_user_id)
):
    return get_patient_service(patient_id, db)


# Sends an OTP to the user's email for password reset
@router.post("/request-password-reset/")
async def request_password_reset(
    request: PasswordResetRequest, db: Session = Depends(get_db)
):
    return await request_password_reset_service(request, db)


# Verifies the OTP entered by the user
@router.post("/verify-reset-otp/")
def verify_password_reset_otp(request: OTPVerification):
    is_verified = verify_password_reset_otp_service(request.email, request.otp)
    if is_verified:
        return {"message": "OTP verified successfully"}
    else:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")


# Resets the user's password after successful OTP verification
@router.post("/reset-password/")
def reset_password(request: PasswordReset, db: Session = Depends(get_db)):
    return reset_password_service(request.email, request.new_password, request.otp, db)


# Handles Google OAuth signup/login for patients
@router.post("/auth/google/patient/")
def google_auth_patient(request: GoogleAuthRequest, db: Session = Depends(get_db)):
    user_info = verify_google_token(request.token)  # Verify the token
    if not user_info:
        raise HTTPException(status_code=400, detail="Invalid Google Token")

    return google_signup_service(user_info, db)  
