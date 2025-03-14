from sqlalchemy.orm import Session
from models.patient_model import Patient


# Get patient by email
def get_patient_by_email(db: Session, email: str):
    return db.query(Patient).filter(Patient.email == email).first()


# Create new patient
def create_patient(db: Session, email: str, hashed_password: str):
    new_patient = Patient(email=email, password=hashed_password)
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)
    return new_patient


# Update patient profile
def update_patient(db: Session, patient_id: int, patient_data):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise Exception("Patient not found")

    for key, value in patient_data.dict().items():
        if value:
            setattr(patient, key, value)

    db.commit()
    db.refresh(patient)
    return patient
