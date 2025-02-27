from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from typing import List, Dict, Any
from services.patient_service import PatientService
from services.session_service import SessionService
from utils.auth_utils import get_current_patient
from database.database import get_db
from sqlalchemy.orm import Session

from schemas.patient_schema import (
    PatientSignupSchema,
    PatientLoginSchema,
    PatientUpdateSchema,
    PatientProfileSchema,
)

from models.patient_model import Patient

router = APIRouter(prefix="/patient", tags=["Patient"])


# Signup endpoint creates a new patient and linked user
@router.post(
    "/signup", status_code=status.HTTP_201_CREATED, response_model=Dict[str, str]
)
async def signup(patient_data: PatientSignupSchema, db: Session = Depends(get_db)):
    return PatientService.register_patient(patient_data, db)


# Login endpoint creates a session and sets the cookie
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
    response.set_cookie(key="session_token", value=session_token, httponly=True)
    return result


# Logout endpoint to remove the session
@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(request: Request):
    return SessionService.remove_user_session(request)


@router.get("/me", response_model=PatientProfileSchema)
async def get_patient_profile(request: Request, db: Session = Depends(get_db)):
    return get_current_patient(request, db)


# Update endpoint for patient profile
@router.put("/update-profile", response_model=PatientProfileSchema)
async def update_patient_profile(
    update_data: PatientUpdateSchema,
    patient: Patient = Depends(get_current_patient),
    db: Session = Depends(get_db),
):
    return PatientService.update_patient_profile(patient, update_data, db)
