from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database.database import Base


class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=True)
    image_url = Column(String, nullable=True)

    # Relationships with doctors and appointments
    doctors = relationship("Doctor", back_populates="department", cascade="all, delete")
    appointments = relationship(
        "Appointment", back_populates="department", cascade="all, delete"
    )
