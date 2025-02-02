from sqlalchemy import Column, Integer, String, Boolean, LargeBinary
from database.database import Base


class Doctor(Base):
    __tablename__ = "doctor"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    name = Column(String, nullable=True)
    specialization = Column(String, nullable=True)
    qualification = Column(String, nullable=True)
    experience = Column(Integer, nullable=True)
    phonenumber = Column(String, nullable=True)
    address = Column(String, nullable=True)
    degree = Column(LargeBinary, nullable=True)
    profilepicture = Column(LargeBinary, nullable=True)
    is_verified = Column(Boolean, default=False)
