from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from database.database import get_db
from services.session_service import SessionService
from models.patient_model import Patient


def get_current_patient(request: Request, db: Session = Depends(get_db)):
    # Retrieve session token from headers first, then from cookies
    token = request.headers.get("session_token")
    if not token or not token.strip():
        token = request.cookies.get("session_token")

    if not token:
        raise HTTPException(status_code=401, detail="Session not found")

    # Use the token to get user_id and role from Redis
    user_id, role = SessionService.get_session_user_from_token(token)

    if role != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized access"
        )

    # Directly query the Patient model using the session's user_id
    patient = db.query(Patient).filter(Patient.user_id == user_id).first()

    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found"
        )
    return patient
