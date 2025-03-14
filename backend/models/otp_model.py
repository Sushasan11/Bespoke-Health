from sqlalchemy import Column, String, Integer, DateTime
from datetime import datetime, timedelta
from database.database import Base


class OTP(Base):
    __tablename__ = "otps"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)
    otp = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Check if OTP is expired (valid for 5 minutes)
    def is_expired(self):
        return datetime.utcnow() > self.created_at + timedelta(minutes=5)
