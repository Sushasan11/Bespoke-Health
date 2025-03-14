from sqlalchemy.orm import Session
from models.otp_model import OTP
from datetime import datetime, timedelta


# Store OTP in database, replacing any existing one
def save_otp(db: Session, email: str, otp: str):
    existing_otp = db.query(OTP).filter(OTP.email == email).first()
    if existing_otp:
        db.delete(existing_otp)
        db.commit()

    new_otp = OTP(email=email, otp=otp)
    db.add(new_otp)
    db.commit()
    db.refresh(new_otp)
    return new_otp


# Retrieve OTP if it is still valid (not expired)
def get_valid_otp(db: Session, email: str):
    otp_record = db.query(OTP).filter(OTP.email == email).first()
    if otp_record and not otp_record.is_expired():
        return otp_record.otp
    return None


# Remove OTP after use or expiration
def delete_otp(db: Session, email: str):
    otp_record = db.query(OTP).filter(OTP.email == email).first()
    if otp_record:
        db.delete(otp_record)
        db.commit()
