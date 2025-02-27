from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from typing import List
from schemas.department_schema import DepartmentCreate, DepartmentUpdate, DepartmentOut
from database.database import get_db
from models.department_model import Department

router = APIRouter(prefix="/departments", tags=["Departments"])


# GET /departments - Retrieve all departments
@router.get("/", response_model=List[DepartmentOut])
def get_departments(db: Session = Depends(get_db)):
    departments = db.query(Department).all()
    return departments


# GET /departments/{department_id} - Retrieve a single department by ID
@router.get("/{department_id}", response_model=DepartmentOut)
def get_department(department_id: int, db: Session = Depends(get_db)):
    dept = db.query(Department).filter(Department.id == department_id).first()
    if not dept:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Department not found"
        )
    return dept


# POST /departments - Create a new department
@router.post("/", response_model=DepartmentOut, status_code=status.HTTP_201_CREATED)
def create_department(department: DepartmentCreate, db: Session = Depends(get_db)):
    existing = db.query(Department).filter(Department.name == department.name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Department already exists",
        )
    new_dept = Department(
        name=department.name,
        description=department.description,
        image_url=department.image_url,
    )
    db.add(new_dept)
    db.commit()
    db.refresh(new_dept)
    return new_dept


# PUT /departments/{department_id} - Update an existing department
@router.put("/{department_id}", response_model=DepartmentOut)
def update_department(
    department_id: int, department: DepartmentUpdate, db: Session = Depends(get_db)
):
    dept = db.query(Department).filter(Department.id == department_id).first()
    if not dept:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Department not found"
        )
    update_data = department.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(dept, key, value)
    db.commit()
    db.refresh(dept)
    return dept


# DELETE /departments/{department_id} - Delete a department
@router.delete("/{department_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_department(department_id: int, db: Session = Depends(get_db)):
    dept = db.query(Department).filter(Department.id == department_id).first()
    if not dept:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Department not found"
        )
    db.delete(dept)
    db.commit()
    return None
