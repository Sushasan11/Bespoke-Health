from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class AppointmentCreateSchema(BaseModel):
    id: int
    doctor_id: int
    patient_id: int
    department_id: int
    appointment_date: datetime
    status: Optional[str] = "scheduled"


class AppointmentSchema(BaseModel):
    id: int
    doctor_id: int
    patient_id: int
    department_id: int
    appointment_date: datetime
    status: str

    class Config:
        from_attributes = True
