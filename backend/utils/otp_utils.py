from datetime import datetime, timedelta
import random
import logging
from utils.email_utils import send_otp_email

otp_storage = {}
otp_expiry_times = {}
logger = logging.getLogger(__name__)


def send_otp(email: str):
    if email in otp_storage:
        if datetime.utcnow() < otp_expiry_times[email]:
            logger.warning(f"OTP already sent to {email} and not yet expired.")
            return None

    otp = random.randint(100000, 999999)
    otp_storage[email] = otp  
    otp_expiry_times[email] = datetime.utcnow() + timedelta(minutes=5)

    try:
        send_otp_email(email, "Your OTP Code", otp)
        logger.info(f"OTP sent to {email}: {otp}")
    except Exception as e:
        logger.error(f"Failed to send OTP to {email}: {str(e)}")

    return otp


def delete_otp(email: str):
    if email in otp_storage:
        del otp_storage[email]
    if email in otp_expiry_times:
        del otp_expiry_times[email]


def is_otp_expired(email: str) -> bool:
    return datetime.utcnow() > otp_expiry_times.get(email, datetime.min)


def verify_otp(email: str, otp: int) -> bool:
    if email in otp_storage and not is_otp_expired(email):
        if otp_storage[email] == otp:
            delete_otp(email)
            return True
    return False
