from sqlalchemy import Column, Integer, String, Boolean, LargeBinary
from database.database import Base


class Doctor(Base):
    __tablename__ = "doctor"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    specialization = Column(String, nullable=False)
    qualification = Column(String, nullable=False)
    experience = Column(Integer, nullable=False)
    phonenumber = Column(String, nullable=False)
    address = Column(String, nullable=False)
    degree = Column(LargeBinary, nullable=False)  
    profilepicture = Column(LargeBinary, nullable=False)  
    is_verified = Column(Boolean, default=False)
    kyc_status = Column(String, default="pending", nullable=False)
