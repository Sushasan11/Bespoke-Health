from sqlalchemy.orm import Session
from models.doctor_model import Doctor
from schemas.doctor_schema import KYCApprovalSchema
from fastapi import HTTPException


# Service class to handle admin functionalities
class AdminService:

    # Approve or reject doctor KYC request
    @staticmethod
    def approve_kyc(doctor_id: int, request: KYCApprovalSchema, db: Session):
        doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor not found")

        # Validate KYC status
        if request.status not in ["approved", "rejected"]:
            raise HTTPException(status_code=400, detail="Invalid KYC status")

        # Update doctor's KYC status
        doctor.kyc_status = request.status
        db.commit()
        return {"message": f"Doctor KYC {request.status}"}
