from fastapi import APIRouter, status, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import shutil
import os
import uuid
from schemas.department_schema import DepartmentCreate, DepartmentUpdate, DepartmentOut
from database.database import get_db
from models.department_model import Department
from fastapi.staticfiles import StaticFiles

router = APIRouter(prefix="/departments", tags=["Departments"])

# Ensure upload directory exists
UPLOAD_DIR = "uploads/departments"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Serve Uploaded Images
router.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


# Get all departments
@router.get("/", response_model=list[DepartmentOut])
def get_departments(db: Session = Depends(get_db)):
    departments = db.query(Department).all()

    for dept in departments:
        if dept.image_url and not dept.image_url.startswith("/uploads/"):
            dept.image_url = f"/uploads/departments/{dept.image_url}".lstrip(
                "/"
            )  # Ensures correct format

    return departments


# Create a new department
@router.post("/", response_model=DepartmentOut)
async def create_department(
    name: str,
    description: str,
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    existing = db.query(Department).filter(Department.name == name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Department already exists")

    # Save image with a unique filename
    ext = os.path.splitext(image.filename)[1]
    image_filename = f"{uuid.uuid4()}{ext}"
    image_path = os.path.join(UPLOAD_DIR, image_filename)
    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    new_dept = Department(
        name=name,
        description=description,
        image_url=f"/uploads/departments/{image_filename}",  # Store correct path in DB
    )
    db.add(new_dept)
    db.commit()
    db.refresh(new_dept)
    return new_dept


# Update an existing department
@router.put("/{department_id}", response_model=DepartmentOut)
async def update_department(
    department_id: int,
    name: str = None,
    description: str = None,
    image: UploadFile = None,
    db: Session = Depends(get_db),
):
    dept = db.query(Department).filter(Department.id == department_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")

    # Update name & description
    if name:
        dept.name = name
    if description:
        dept.description = description

    # Update image if provided
    if image:
        ext = os.path.splitext(image.filename)[1]
        image_filename = f"{uuid.uuid4()}{ext}"
        image_path = os.path.join(UPLOAD_DIR, image_filename)

        # Remove old image if exists
        if dept.image_url:
            old_image_path = os.path.join(
                UPLOAD_DIR, dept.image_url.lstrip("/uploads/departments/")
            )
            if os.path.exists(old_image_path):
                os.remove(old_image_path)

        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        dept.image_url = f"/uploads/departments/{image_filename}"

    db.commit()
    db.refresh(dept)
    return dept


# Delete a department
@router.delete("/{department_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_department(department_id: int, db: Session = Depends(get_db)):
    dept = db.query(Department).filter(Department.id == department_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")

    # Delete image file if exists
    if dept.image_url:
        image_path = os.path.join(
            UPLOAD_DIR, dept.image_url.lstrip("/uploads/departments/")
        )
        if os.path.exists(image_path):
            os.remove(image_path)

    db.delete(dept)
    db.commit()
    return None
