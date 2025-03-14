from datetime import datetime, timedelta
import random
import asyncio
from utils.email_utils import send_otp_email

# In-memory storage for OTPs
otp_storage = {}
otp_expiry_times = {}


# Generates a 6-digit OTP and stores it with a 5-minute expiration
def generate_otp(email: str) -> int:
    otp = random.randint(100000, 999999)
    otp_storage[email] = otp
    otp_expiry_times[email] = datetime.utcnow() + timedelta(minutes=5)
    return otp


# Sends an OTP via email and stores it
async def send_otp(email: str):
    if email in otp_storage and datetime.utcnow() < otp_expiry_times[email]:
        return None

    otp = generate_otp(email)
    try:
        await asyncio.to_thread(send_otp_email, email, "Your OTP Code", otp)
        return otp
    except Exception as e:
        return False


# Deletes an OTP from storage
def delete_otp(email: str):
    otp_storage.pop(email, None)
    otp_expiry_times.pop(email, None)


# Checks if an OTP has expired
def is_otp_expired(email: str) -> bool:
    return datetime.utcnow() > otp_expiry_times.get(email, datetime.min)


# Verifies if the given OTP is correct and deletes it after successful verification
def verify_otp(email: str, otp: int) -> bool:
    if email in otp_storage and not is_otp_expired(email):
        if otp_storage[email] == otp:
            delete_otp(email)
            return True
    return False
