import os
import jwt
import datetime
from passlib.context import CryptContext
from dotenv import load_dotenv
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database.database import get_db
from models.patient_model import Patient

# Load environment variables from .env
load_dotenv()

# Securely fetch SECRET_KEY from .env
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY is missing in environment variables!")

# JWT Configuration
ALGORITHM = "HS256"  # Algorithm used for JWT encoding
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # Default expiration time for JWT tokens

# Password hashing setup using bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme for retrieving bearer token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


# Hash Password
def hash_password(password: str) -> str:
    """Hashes a password securely using bcrypt."""
    return pwd_context.hash(password)


# Verify Password
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies if a plain password matches the hashed password."""
    return pwd_context.verify(plain_password, hashed_password)


# Create JWT Access Token
def create_access_token(data: dict, expires_delta: int = None):
    """Generates a JWT access token with an optional expiration time."""
    to_encode = data.copy()

    # Set token expiration time
    expire = datetime.datetime.utcnow() + datetime.timedelta(
        minutes=expires_delta or ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({"exp": expire})

    # Encode the JWT token
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# Decode JWT Access Token
def decode_access_token(token: str):
    """Decodes a JWT token and handles different exceptions."""
    try:
        # Decode the JWT token using the secret key
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return {"error": "Token has expired"}
    except jwt.InvalidTokenError:
        return {"error": "Invalid token"}


# Refresh JWT Access Token
def refresh_access_token(token: str):
    """Refreshes an expired token if it's valid but expired."""
    payload = decode_access_token(token)

    # Check if token has errors
    if "error" in payload:
        return payload

    # Generate a new token with the same user data
    new_token = create_access_token({"sub": payload["sub"]})

    return {"access_token": new_token, "token_type": "bearer"}


# Retrieve Current Authenticated User ID
def get_current_user_id(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    try:
        # Decode the JWT token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")  # Extract email from payload

        # Check if email exists
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication token")

        # Fetch user from database
        user = db.query(Patient).filter(Patient.email == email).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")

        return user.id
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
