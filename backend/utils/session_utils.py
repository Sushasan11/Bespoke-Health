import redis
import uuid
import os
from fastapi import HTTPException, Request, Response

# Load Redis configuration
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6380))
REDIS_DB = int(os.getenv("REDIS_DB", 0))
REDIS_SOCKET_TIMEOUT = int(os.getenv("REDIS_SOCKET_TIMEOUT", 5))
SESSION_EXPIRY = int(os.getenv("SESSION_EXPIRY", 3600))  # 1 hour
OTP_EXPIRY = int(os.getenv("OTP_EXPIRY", 300))  # 5 minutes

# Initialize Redis client
try:
    redis_client = redis.Redis(
        host=REDIS_HOST,
        port=REDIS_PORT,
        db=REDIS_DB,
        decode_responses=True,
        socket_connect_timeout=REDIS_SOCKET_TIMEOUT,
    )
    redis_client.ping()
except redis.ConnectionError:
    raise Exception("Redis connection failed. Ensure Redis is running.")


# Create a session and store it in Redis
def create_session(user_id: int, role: str) -> str:
    session_token = str(uuid.uuid4())
    redis_client.setex(f"session:{session_token}", SESSION_EXPIRY, user_id)
    redis_client.setex(f"session_role:{session_token}", SESSION_EXPIRY, role)
    return session_token


# Retrieve user session from Redis
def get_session_user(request: Request):
    session_token = request.cookies.get("session_token")
    if not session_token:
        raise HTTPException(status_code=401, detail="Session not found")

    user_id = redis_client.get(f"session:{session_token}")
    role = redis_client.get(f"session_role:{session_token}")

    if not user_id or not role:
        raise HTTPException(status_code=401, detail="Session expired or invalid")

    # Extend session expiry on activity
    redis_client.expire(f"session:{session_token}", SESSION_EXPIRY)
    redis_client.expire(f"session_role:{session_token}", SESSION_EXPIRY)

    return int(user_id), role


# Verify session token (returns user ID & role)
def verify_session_token(session_token: str):
    user_id = redis_client.get(f"session:{session_token}")
    role = redis_client.get(f"session_role:{session_token}")

    if not user_id or not role:
        return None
    return int(user_id), role


# Remove user session from Redis (Logout)
def remove_session(request: Request, response: Response):
    session_token = request.cookies.get("session_token")
    if session_token:
        redis_client.delete(f"session:{session_token}")
        redis_client.delete(f"session_role:{session_token}")

    # Clear session cookie from browser
    response.delete_cookie("session_token", path="/", domain="127.0.0.1")
    return {"message": "Logged out successfully"}


# Store OTP in Redis with expiration time
def store_otp(email: str, otp: str):
    redis_client.setex(f"otp:{email}", OTP_EXPIRY, otp)


# Retrieve OTP from Redis
def get_otp(email: str):
    return redis_client.get(f"otp:{email}")


# Delete OTP from Redis
def delete_otp(email: str):
    redis_client.delete(f"otp:{email}")
