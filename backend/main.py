from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import redis
from sqlalchemy import inspect
from database.database import engine, Base
from controller.patient_controller import router as patient_router
from controller.doctor_controller import router as doctor_router
from controller.admin_controller import router as admin_router
from controller.department_controller import router as department_router
from controller.appointment_controller import router as appointment_router
from controller.chat_controller import router as chat_router
from models import (
    admin_model,
    doctor_model,
    patient_model,
    department_model,
    notification_model,
    transactions_model,
    user_model,
    appointment_model,
)


# Initialize FastAPI App
app = FastAPI(title="Bespoke Health System")

# Create all tables at the start
Base.metadata.create_all(bind=engine)


# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include Routers
app.include_router(patient_router)
app.include_router(doctor_router)
app.include_router(admin_router)
app.include_router(department_router)
app.include_router(appointment_router)
app.include_router(chat_router)


# Root Route
@app.get("/")
def home():
    return {"message": "Bespoke Health System API is running!"}
