from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database.database import engine, Base
from controller.patient_controller import router as patient_router
from controller.doctor_controller import router as doctor_router
from controller.admin_controller import router as admin_router
from controller.department_controller import router as department_router
from controller.appointment_controller import router as appointment_router
from controller.chat_controller import router as chat_router
from controller.notification_controller import router as notification_router
import os

# Initialize FastAPI App
app = FastAPI()

# Create all tables at the start
Base.metadata.create_all(bind=engine)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure all upload directories exist
UPLOAD_DIRS = [
    "uploads/departments",
    "uploads/profile_pictures",
    "uploads/certificates",
]
for directory in UPLOAD_DIRS:
    os.makedirs(directory, exist_ok=True)

# Serve Uploaded Images Properly
app.mount("/uploads", StaticFiles(directory="uploads", html=True), name="uploads")

# Include Routers
app.include_router(patient_router)
app.include_router(doctor_router)
app.include_router(admin_router)
app.include_router(department_router)
app.include_router(appointment_router)
app.include_router(chat_router)
app.include_router(notification_router)
