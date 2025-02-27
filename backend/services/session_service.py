from fastapi import HTTPException, Request, status
from sqlalchemy.orm import Session
from utils.hash_password import verify_password
from models.user_model import User
from utils.session_utils import (
    create_session,
    get_session_user,
    remove_session,
    store_otp,
    get_otp,
    delete_otp,
    redis_client,
)


class SessionService:
    @staticmethod
    def create_user_session(
        request: Request, email: str, password: str, role: str, db: Session
    ):
        user = db.query(User).filter(User.email == email).first()
        if not user or not verify_password(password, user.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        if user.role != role:
            raise HTTPException(status_code=403, detail="Unauthorized access")
        session_token = create_session(user.id, user.role)
        return {
            "message": "Login successful",
            "session_token": session_token,
            "role": user.role,
        }

    @staticmethod
    def remove_user_session(request: Request):
        return remove_session(request)

    @staticmethod
    def get_session_user(request: Request):
        return get_session_user(request)

    @staticmethod
    def get_session_user_from_token(session_token: str):
        user_id = redis_client.get(f"session:{session_token}")
        role = redis_client.get(f"session_role:{session_token}")
        if not user_id or not role:
            raise HTTPException(status_code=401, detail="Session expired or invalid")
        return int(user_id), role

    @staticmethod
    def store_otp(email: str, otp: str):
        store_otp(email, otp)

    @staticmethod
    def get_otp(email: str):
        return get_otp(email)

    @staticmethod
    def delete_otp(email: str):
        delete_otp(email)
