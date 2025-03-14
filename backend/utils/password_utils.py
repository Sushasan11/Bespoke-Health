import os
import jwt
import datetime
from passlib.context import CryptContext
from dotenv import load_dotenv
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database.database import get_db
from models.doctor_model import Doctor  # Ensure you import the Doctor model

# Load environment variables
load_dotenv()

# Securely fetch SECRET_KEY from .env
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY is missing in environment variables!")

# JWT Configuration
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Password hashing setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme for retrieving bearer token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


# Hash password
def hash_password(password: str) -> str:
    return pwd_context.hash(password)


# Verify password
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# Create JWT access token
def create_access_token(data: dict, expires_delta: int = None):
    to_encode = data.copy()

    expire_minutes = (
        expires_delta if expires_delta is not None else ACCESS_TOKEN_EXPIRE_MINUTES
    )
    expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=expire_minutes)

    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# Decode JWT access token
def decode_access_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        return {"error": "Token has expired"}
    except jwt.PyJWTError:
        return {"error": "Invalid token"}


# Retrieve current authenticated doctor ID
def get_current_user_id(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")

        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication token")

        doctor = db.query(Doctor).filter(Doctor.email == email).first()
        if doctor is None:
            raise HTTPException(status_code=401, detail="User not found")

        return doctor.id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
