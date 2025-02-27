import redis
import uuid
from fastapi import HTTPException, Request

# Initialize Redis
redis_client = redis.Redis(
    host="localhost", port=6380, decode_responses=True, socket_connect_timeout=5
)
redis_client.ping()

# Session expiration time in seconds (1 hour)
SESSION_EXPIRY = 3600
# OTP expiration time in seconds (5 minutes)
OTP_EXPIRY = 300


def create_session(user_id: int, role: str) -> str:
    session_token = str(uuid.uuid4())
    # Store the user_id and role with an expiration time
    redis_client.setex(f"session:{session_token}", SESSION_EXPIRY, user_id)
    redis_client.setex(f"session_role:{session_token}", SESSION_EXPIRY, role)
    return session_token


def get_session_user(request: Request):
    session_token = request.cookies.get("session_token")
    if not session_token:
        raise HTTPException(status_code=401, detail="Session not found")
    user_id = redis_client.get(f"session:{session_token}")
    role = redis_client.get(f"session_role:{session_token}")
    if not user_id or not role:
        raise HTTPException(status_code=401, detail="Session expired or invalid")
    return int(user_id), role


def remove_session(request: Request):
    session_token = request.cookies.get("session_token")
    if session_token:
        redis_client.delete(f"session:{session_token}")
        redis_client.delete(f"session_role:{session_token}")
    return {"message": "Logged out successfully"}


def store_otp(email: str, otp: str):
    redis_client.setex(f"otp:{email}", OTP_EXPIRY, otp)


def get_otp(email: str):
    return redis_client.get(f"otp:{email}")


def delete_otp(email: str):
    redis_client.delete(f"otp:{email}")
