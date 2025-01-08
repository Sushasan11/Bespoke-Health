import random
from datetime import datetime, timedelta
from utils.email_utils import send_otp_email
import logging

otp_storage = {}
otp_expiry_times = {}

# Logging setup
logger = logging.getLogger(__name__)


# Send email to the user
def send_otp(email: str):
    otp = random.randint(100000, 999999)
    otp_storage[email] = otp
    otp_expiry_times[email] = datetime.utcnow() + timedelta(minutes=5)
    send_otp_email(email, "Your OTP Code", otp)
    logger.info(f"OTP sent to {email}: {otp}")
    return otp
