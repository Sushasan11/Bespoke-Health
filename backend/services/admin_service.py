from fastapi import HTTPException, status, Request, Response
from sqlalchemy.orm import Session
from sqlalchemy import func
from utils.hash_password import verify_password
from repositories.admin_repositories import get_admin_by_email
from services.session_service import SessionService
from models.department_model import Department
from models.user_model import User
from models.doctor_model import Doctor
from models.transactions_model import UserTransaction


def admin_login_service(
    db: Session, email: str, password: str, request: Request, response: Response
):
    admin = get_admin_by_email(db, email)
    if not verify_password(password, admin.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password"
        )

    result = SessionService.create_user_session(request, email, password, "admin", db)
    session_token = result["session_token"]
    response.set_cookie(key="session_token", value=session_token, httponly=True)
    return {"message": "Login successful", "session_token": session_token}


def get_admin_dashboard_stats(db: Session):
    # Pending KYC counts from the User model
    pending_patients = (
        db.query(User)
        .filter(User.role == "patient", User.kyc_verified == False)
        .count()
    )
    pending_doctors = (
        db.query(User).filter(User.role == "doctor", User.kyc_verified == False).count()
    )
    total_patients = db.query(User).filter(User.role == "patient").count()
    total_doctors = db.query(User).filter(User.role == "doctor").count()

    # Actual transaction stats: sum up amounts for each transaction type
    appointment_total = (
        db.query(func.sum(UserTransaction.amount))
        .filter(UserTransaction.transaction_type == "appointment")
        .scalar()
        or 0
    )
    emedical_total = (
        db.query(func.sum(UserTransaction.amount))
        .filter(UserTransaction.transaction_type == "emedical")
        .scalar()
        or 0
    )
    transaction_stats = {
        "appointment_total": float(appointment_total),
        "emedical_total": float(emedical_total),
    }

    # Top doctor: the doctor with the highest total transaction amount
    top_doctor_query = (
        db.query(Doctor, func.sum(UserTransaction.amount).label("total"))
        .join(UserTransaction, Doctor.id == UserTransaction.doctor_id)
        .group_by(Doctor.id)
        .order_by(func.sum(UserTransaction.amount).desc())
        .first()
    )
    top_doctor = top_doctor_query[0].email if top_doctor_query else None

    # Top department: the department with the highest number of doctors
    top_department_query = (
        db.query(Department, func.count(Doctor.id).label("doctor_count"))
        .join(Doctor, Department.id == Doctor.department_id)
        .group_by(Department.id)
        .order_by(func.count(Doctor.id).desc())
        .first()
    )
    top_department = top_department_query[0].name if top_department_query else None

    stats = {
        "pending_patients": pending_patients,
        "pending_doctors": pending_doctors,
        "total_patients": total_patients,
        "total_doctors": total_doctors,
        "transaction_stats": transaction_stats,
        "top_doctor": top_doctor,
        "top_department": top_department,
    }
    return stats
