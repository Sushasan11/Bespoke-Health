from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from database.database import get_db
from schemas.appointment_schema import AppointmentCreateSchema, AppointmentSchema
from models.appointment_model import Appointment
from models.patient_model import Patient
from models.doctor_model import Doctor
from models.department_model import Department
from services.notification_service import websocket_manager

router = APIRouter(prefix="/appointments", tags=["Appointments"])


@router.post("/", response_model=AppointmentSchema, status_code=status.HTTP_201_CREATED)
async def create_appointment(
    appointment: AppointmentCreateSchema, db: Session = Depends(get_db)
):
    # Fetch patient details
    patient = db.query(Patient).filter(Patient.id == appointment.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Block unverified patients
    if not patient.kyc_verified:
        await websocket_manager.send_message(
            str(patient.id), "You must complete KYC verification to book an appointment"
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="KYC verification required to book an appointment",
        )

    # Allow booking if KYC is verified
    new_appointment = Appointment(
        doctor_id=appointment.doctor_id,
        patient_id=appointment.patient_id,
        department_id=appointment.department_id,
        appointment_date=appointment.appointment_date,
        status=appointment.status,
    )
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)

    # Send a real-time notification to the doctor and patient
    await websocket_manager.send_message(
        str(appointment.doctor_id),
        f"New appointment booked with Patient ID: {appointment.patient_id}",
    )
    await websocket_manager.send_message(
        str(appointment.patient_id),
        f"Your appointment with Doctor ID: {appointment.doctor_id} is confirmed!",
    )

    return new_appointment


# Get an appointment by ID
@router.get("/{appointment_id}", response_model=AppointmentSchema)
def get_appointment(appointment_id: int, db: Session = Depends(get_db)):
    appt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found"
        )
    return appt


# List all appointments
@router.get("/", response_model=list[AppointmentSchema])
def list_appointments(db: Session = Depends(get_db)):
    return db.query(Appointment).all()


# Update an appointment
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

    # Validate doctor ID
    if appointment.doctor_id <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid doctor_id provided"
        )
    doctor = db.query(Doctor).filter(Doctor.id == appointment.doctor_id).first()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found"
        )

    # Validate department ID
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
