from fastapi import WebSocket
from typing import Dict, List
from sqlalchemy.orm import Session
from database.database import SessionLocal
from models.patient_model import Patient
from models.doctor_model import Doctor


class WebSocketManager:
    def __init__(self):
        # Store Active WebSocket Connections
        self.active_connections: Dict[str, List[WebSocket]] = {}

    # Handle WebSocket Connection
    async def connect(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)

        # Check KYC Status and Notify if Incomplete
        db = SessionLocal()
        try:
            patient = db.query(Patient).filter(Patient.id == user_id).first()
            doctor = db.query(Doctor).filter(Doctor.id == user_id).first()

            if patient and not patient.kyc_verified:
                await self.send_message(
                    user_id, "Your KYC is not verified. Please complete it."
                )
            elif doctor and doctor.kyc_status != "approved":
                await self.send_message(
                    user_id, "Your KYC is not verified. Please complete it."
                )
        finally:
            db.close()

    # Handle WebSocket Disconnection
    async def disconnect(self, user_id: str, websocket: WebSocket):
        if user_id in self.active_connections:
            self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]

    # Send a Message to a Specific User
    async def send_message(self, user_id: str, message: str):
        if user_id in self.active_connections:
            for websocket in self.active_connections[user_id]:
                await websocket.send_text(message)


# Instantiate WebSocketManager
websocket_manager = WebSocketManager()
