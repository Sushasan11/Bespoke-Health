from sqlalchemy.orm import Session
from models.patient_model import Patient
from models.user_model import User
from schemas.patient_schema import PatientSignupSchema, PatientUpdateSchema
from utils.hash_password import hash_password
from fastapi import HTTPException, status
import traceback
from sqlalchemy.exc import SQLAlchemyError


# Fetches a patient by email, ensuring the linked User exists
def get_patient_by_email(db: Session, email: str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    patient = db.query(Patient).filter(Patient.user_id == user.id).first()
    return patient


# Fetches a patient by their ID
def get_patient_by_id(db: Session, patient_id: int):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found."
        )
    return patient


# Creates a new patient and a linked user entry
def create_patient(db: Session, patient_data: PatientSignupSchema):
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == patient_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is already registered. Please log in instead.",
            )
        # Hash the provided password
        hashed_password = hash_password(patient_data.password)
        # Create User entry with role "patient"
        new_user = User(
            email=patient_data.email, password=hashed_password, role="patient"
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        # Create Patient entry linked to the User
        new_patient = Patient(user_id=new_user.id, email=new_user.email)
        db.add(new_patient)
        db.commit()
        db.refresh(new_patient)
        # Return response with fields converted to the expected types
        return {
            "id": str(new_patient.id),
            "email": new_patient.email,
            "user_id": str(new_patient.user_id),
            "kyc_verified": str(new_patient.kyc_verified),
        }
    except SQLAlchemyError:
        db.rollback()
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error"
        )
    except Exception:
        db.rollback()
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Unexpected error"
        )


# Updates the profile information of a patient
def update_patient_profile(
    db: Session, patient: Patient, update_data: PatientUpdateSchema
):
    try:
        for field, value in update_data.dict(exclude_unset=True).items():
            setattr(patient, field, value)
        db.commit()
        db.refresh(patient)
        return patient
    except SQLAlchemyError:
        db.rollback()
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error"
        )


# Deletes a patient by ID and also removes the linked User entry
def delete_patient(db: Session, patient_id: int):
    try:
        patient = db.query(Patient).filter(Patient.id == patient_id).first()
        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found."
            )
        # Delete linked User if it exists; if not, show an error.
        user = db.query(User).filter(User.id == patient.user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Linked user not found."
            )
        db.delete(user)
        db.delete(patient)
        db.commit()
        return True
    except SQLAlchemyError:
        db.rollback()
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database error"
        )
