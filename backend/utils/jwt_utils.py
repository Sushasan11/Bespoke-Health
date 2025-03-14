import os
import jwt
import datetime
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Get environment variables securely
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")


def create_access_token(data: dict, expires_delta: int = None):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(
        minutes=expires_delta or 60  # Default expiration: 60 minutes
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
