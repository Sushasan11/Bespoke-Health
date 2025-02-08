import requests
from fastapi import HTTPException
import os

# Load Google Client ID from environment variables
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")


def verify_google_token(token: str):
    # Verify OTP
    google_url = f"https://oauth2.googleapis.com/tokeninfo?id_token={token}"
    response = requests.get(google_url)

    # If Google Token is invalid, raise an error
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Invalid Google Token")

    user_info = response.json()

    # Ensure the token is issued for the correct Google Client ID
    if user_info["aud"] != GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=400, detail="Invalid Google Client ID")

    # Extract required user information
    return {
        "email": user_info.get("email"),
        "name": user_info.get("name"),
        "password": user_info.get("password"),
        "profile_picture": user_info.get("picture"),
    }
