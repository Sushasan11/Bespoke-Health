from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database.database import Base


class UserTransaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    transaction_type = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(String, default="processing", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Foreign Keys
    patient_id = Column(
        Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=True
    )
    doctor_id = Column(
        Integer, ForeignKey("doctors.id", ondelete="CASCADE"), nullable=True
    )

    # Relationships
    patient = relationship(
        "Patient", back_populates="transactions", foreign_keys=[patient_id]
    )
    doctor = relationship(
        "Doctor", back_populates="transactions", foreign_keys=[doctor_id]
    )
