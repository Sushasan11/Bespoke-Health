from sqlalchemy.orm import Session
from models.user_model import User
from fastapi import HTTPException, status


def get_admin_by_email(db: Session, email: str):
    admin = db.query(User).filter(User.email == email, User.role == "admin").first()
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Admin not found"
        )
    return admin
