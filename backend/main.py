import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.database import Base, engine
from controller.patient_controller import router as patient_router


app = FastAPI()

# CORS Configuration
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create tables in the database on startup
@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)


# Include router
app.include_router(patient_router)
