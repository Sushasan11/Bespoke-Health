from datetime import datetime, timedelta
import random
import logging
import asyncio
from utils.email_utils import send_otp_email

otp_storage = {}
otp_expiry_times = {}
logger = logging.getLogger(__name__)


async def send_otp(email: str):
    # Checks if an OTP was already sent and is still valid
    if email in otp_storage and datetime.utcnow() < otp_expiry_times[email]:
        logger.warning(f"OTP already sent to {email} and not yet expired.")
        return None

    # Generates a new OTP and stores it temporarily
    otp = random.randint(100000, 999999)
    otp_storage[email] = otp
    otp_expiry_times[email] = datetime.utcnow() + timedelta(minutes=5)

    try:
        # Sends the OTP via email asynchronously to prevent blocking
        await asyncio.to_thread(send_otp_email, email, "Your OTP Code", otp)
        logger.info(f"OTP sent to {email}: {otp}")
        return otp
    except Exception as e:
        logger.error(f"Failed to send OTP to {email}: {str(e)}")
        return False  # Indicates failure in sending OTP


def delete_otp(email: str):
    # Removes the OTP entry from storage
    otp_storage.pop(email, None)
    otp_expiry_times.pop(email, None)


def is_otp_expired(email: str) -> bool:
    # Checks if the OTP has expired
    return datetime.utcnow() > otp_expiry_times.get(email, datetime.min)


def verify_otp(email: str, otp: int) -> bool:
    # Checks if the OTP is valid and removes it after successful verification
    if email in otp_storage and not is_otp_expired(email):
        if otp_storage[email] == otp:
            delete_otp(email)
            return True
    return False
