from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from database.database import get_db
from schemas.appointment_schema import AppointmentCreateSchema, AppointmentSchema
from models.appointment_model import Appointment
from models.doctor_model import Doctor
from models.department_model import Department

router = APIRouter(prefix="/appointments", tags=["Appointments"])


@router.post("/", response_model=AppointmentSchema, status_code=status.HTTP_201_CREATED)
def create_appointment(
    appointment: AppointmentCreateSchema, db: Session = Depends(get_db)
):
    new_appointment = Appointment(
        doctor_id=appointment.doctor_id,
        patient_id=appointment.patient_id,
        department_id=appointment.department_id,  # updated field
        appointment_date=appointment.appointment_date,
        status=appointment.status,
    )
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)
    return new_appointment


@router.get("/{appointment_id}", response_model=AppointmentSchema)
def get_appointment(appointment_id: int, db: Session = Depends(get_db)):
    appt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found"
        )
    return appt


@router.get("/", response_model=list[AppointmentSchema])
def list_appointments(db: Session = Depends(get_db)):
    appointments = db.query(Appointment).all()
    return appointments


@router.put("/{appointment_id}", response_model=AppointmentSchema)
def update_appointment(
    appointment_id: int,
    appointment: AppointmentCreateSchema,
    db: Session = Depends(get_db),
):
    appt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found"
        )

    # Validate doctor_id
    if appointment.doctor_id <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid doctor_id provided"
        )
    doctor = db.query(Doctor).filter(Doctor.id == appointment.doctor_id).first()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found"
        )

    # Validate department_id
    if appointment.department_id <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid department_id provided",
        )
    department = (
        db.query(Department).filter(Department.id == appointment.department_id).first()
    )
    if not department:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Department not found"
        )

    # Update appointment fields
    appt.doctor_id = appointment.doctor_id
    appt.patient_id = appointment.patient_id
    appt.department_id = appointment.department_id
    appt.appointment_date = appointment.appointment_date
    appt.status = appointment.status
    db.commit()
    db.refresh(appt)
    return appt
