import os
from sqlalchemy.orm import Session
from database import SessionLocal
from utils.password_utils import hash_password, verify_password
import logging

# Load environment variables
SUPERADMIN_EMAIL = os.getenv("SUPERADMIN_EMAIL")
SUPERADMIN_PASSWORD = os.getenv("SUPERADMIN_PASSWORD")

# Logging setup
logger = logging.getLogger(__name__)


def create_admin():
    db = SessionLocal()
    try:
        superadmin = db.query(User).filter(User.email == SUPERADMIN_EMAIL).first()
        if not superadmin:
            hashed_password = hash_password(SUPERADMIN_PASSWORD)
            new_superadmin = User(
                email=SUPERADMIN_EMAIL,
                password=hashed_password,
            )
            db.add(new_superadmin)
            db.commit()
            db.refresh(new_superadmin)
            logger.info(f"Superadmin created: {SUPERADMIN_EMAIL}")
        else:
            # Force update the password in case it’s incorrect or out of sync
            if not verify_password(SUPERADMIN_PASSWORD, superadmin.password):
                superadmin.password = hash_password(SUPERADMIN_PASSWORD)
                db.commit()
                logger.info(f"Superadmin password updated for: {SUPERADMIN_EMAIL}")
    finally:
        db.close()
