from fastapi import APIRouter, HTTPException, Depends, Request, Response, status
from sqlalchemy.orm import Session
from database.database import get_db
from schemas.admin_schema import AdminLoginSchema
from schemas.kyc_schema import ApproveKycSchema
from services.admin_service import admin_login_service, get_admin_dashboard_stats
from services.session_service import SessionService
from models.user_model import User

router = APIRouter(prefix="/admin", tags=["Admin"])


# Admin login
@router.post("/login", status_code=200)
def login(
    request: Request,
    response: Response,
    login_data: AdminLoginSchema,
    db: Session = Depends(get_db),
):
    return admin_login_service(
        db, login_data.email, login_data.password, request, response
    )


# Admin logout
@router.post("/logout", status_code=200)
def logout(request: Request):
    SessionService.remove_user_session(request)
    return {"message": "Logged out successfully"}


# Get admin profile
@router.get("/me", status_code=200)
def get_admin_profile(request: Request, db: Session = Depends(get_db)):
    session_token = request.cookies.get("session_token")
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user_id, role = SessionService.get_session_user_from_token(session_token)
    if role != "admin":
        raise HTTPException(status_code=403, detail="Unauthorized")
    admin = db.query(User).filter(User.id == user_id, User.role == "admin").first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    return {"email": admin.email, "role": "admin"}


# Admin dashboard endpoint
@router.get("/dashboard", status_code=200)
def admin_dashboard(db: Session = Depends(get_db)):
    stats = get_admin_dashboard_stats(db)
    return stats


# Add a new department (Admin can add department)
@router.post("/department", status_code=status.HTTP_201_CREATED)
def add_department(dept_data: dict, db: Session = Depends(get_db)):
    from models.department_model import Department

    existing = (
        db.query(Department).filter(Department.name == dept_data.get("name")).first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Department already exists"
        )
    new_dept = Department(
        name=dept_data.get("name"),
        description=dept_data.get("description"),
        image_url=dept_data.get("image_url"),
    )
    db.add(new_dept)
    db.commit()
    db.refresh(new_dept)
    return new_dept


# Top Doctor Endpoint
@router.get("/top-doctor", status_code=200)
def get_top_doctor(db: Session = Depends(get_db)):
    top_doctor = db.query(User).filter(User.role == "doctor").first()
    if not top_doctor:
        raise HTTPException(status_code=404, detail="No doctors found")
    return {"top_doctor": top_doctor.email}


# Top Department Endpoint
@router.get("/top-department", status_code=200)
def get_top_department(db: Session = Depends(get_db)):
    from models.department_model import Department

    top_department = db.query(Department).first()
    if not top_department:
        raise HTTPException(status_code=404, detail="No departments found")
    return {"top_department": top_department.name}


# Approve KYC endpoint
@router.put("/approve-kyc", status_code=200)
def approve_kyc(kyc_data: ApproveKycSchema, db: Session = Depends(get_db)):
    # Check role and update accordingly
    if kyc_data.role.lower() == "doctor":
        from models.doctor_model import Doctor

        doctor = db.query(Doctor).filter(Doctor.user_id == kyc_data.user_id).first()
        if not doctor:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found"
            )
        doctor.kyc_status = "approved" if kyc_data.approved else "pending"
        db.commit()
        db.refresh(doctor)
        return {
            "message": f"KYC {'approved' if kyc_data.approved else 'disapproved'} for doctor with user id {kyc_data.user_id}"
        }

    elif kyc_data.role.lower() == "patient":
        from models.patient_model import Patient

        patient = db.query(Patient).filter(Patient.user_id == kyc_data.user_id).first()
        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found"
            )
        patient.kyc_verified = kyc_data.approved
        db.commit()
        db.refresh(patient)
        return {
            "message": f"KYC {'approved' if kyc_data.approved else 'disapproved'} for patient with user id {kyc_data.user_id}"
        }

    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role"
        )
