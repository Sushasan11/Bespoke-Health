from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database.database import Base
from models.notification_model import Notification


class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    email = Column(
        String, unique=True, nullable=False
    )  # Changed from username to email
    password = Column(String, nullable=False)

    # Relationship to Notifications
    notifications = relationship(
        "Notification", back_populates="admin", cascade="all, delete"
    )
