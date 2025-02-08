from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from database.database import Base


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey("doctor.id"))
    message = Column(String, nullable=False)
    read = Column(Boolean, default=False)
