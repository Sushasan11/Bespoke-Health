from sqlalchemy.orm import Session
from models.user_model import User
from models.doctor_model import Doctor
from models.department_model import Department
from schemas.doctor_schema import DoctorSignupSchema
from utils.hash_password import hash_password
from fastapi import HTTPException, status
import traceback
from sqlalchemy.exc import SQLAlchemyError


def create_doctor(db: Session, doctor_data: DoctorSignupSchema):
    try:
        # Check if a user with the given email already exists
        existing_user = db.query(User).filter(User.email == doctor_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is already registered. Please log in instead.",
            )

        # Verify that the department exists
        if doctor_data.department_id:
            department = (
                db.query(Department)
                .filter(Department.id == doctor_data.department_id)
                .first()
            )
            if not department:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Department not found.",
                )

        hashed_password = hash_password(doctor_data.password)

        # Create the User record with role "doctor"
        new_user = User(
            email=doctor_data.email, password=hashed_password, role="doctor"
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        # Create the Doctor record linked to the new User
        new_doctor = Doctor(
            user_id=new_user.id,
            email=new_user.email,
            name=doctor_data.name,
            department_id=doctor_data.department_id,
            experience=doctor_data.experience,
            phonenumber=doctor_data.phonenumber,
            address=doctor_data.address,
            qualification=doctor_data.qualification,
            kyc_status="pending",
        )
        db.add(new_doctor)
        db.commit()
        db.refresh(new_doctor)

        return new_doctor

    except SQLAlchemyError as e:
        db.rollback()
        # Cleanup if new_user exists
        if "new_user" in locals() and new_user is not None:
            try:
                db.delete(new_user)
                db.commit()
            except Exception:
                db.rollback()
        print("Database Error:", str(e))
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )
    except Exception as e:
        db.rollback()
        print("Unexpected Error:", str(e))
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error: {str(e)}",
        )
