from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database.database import Base
from models.department_model import Department


class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    department_id = Column(
        Integer, ForeignKey("departments.id", ondelete="CASCADE"), nullable=True
    )
    experience = Column(Integer, nullable=False)
    phonenumber = Column(String, nullable=False)
    address = Column(String, nullable=False)
    qualification = Column(String, nullable=False)
    degree_certificate_url = Column(String, nullable=True)
    profile_picture_url = Column(String, nullable=True)
    kyc_status = Column(String, default="pending", nullable=False)

    # Relationships
    department = relationship("Department", back_populates="doctors")
    user = relationship("User", back_populates="doctor")
    transactions = relationship(
        "UserTransaction",
        back_populates="doctor",
        cascade="all, delete",
        foreign_keys="[UserTransaction.doctor_id]",
    )
    appointments = relationship(
        "Appointment", back_populates="doctor", cascade="all, delete"
    )
