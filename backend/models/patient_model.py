from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database.database import Base
from models.transactions_model import UserTransaction


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    email = Column(String, unique=True, index=True, nullable=False)

    name = Column(String, nullable=True)
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    address = Column(String, nullable=True)
    phonenumber = Column(String, nullable=True)

    kyc_verified = Column(Boolean, default=False)
    kyc_pdf_url = Column(String, nullable=True)

    # Relationship with User
    user = relationship("User", back_populates="patient")
    transactions = relationship(
        "UserTransaction",
        back_populates="patient",
        cascade="all, delete",
        foreign_keys="[UserTransaction.patient_id]",
    )
    appointments = relationship(
        "Appointment",
        back_populates="patient",
        cascade="all, delete",
        foreign_keys="[Appointment.patient_id]",
    )

    @property
    def kyc_status(self):
        return "verified" if self.kyc_verified else "pending"
