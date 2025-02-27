from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database.database import Base


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    message = Column(String, nullable=False)
    admin_id = Column(
        Integer, ForeignKey("admins.id", ondelete="CASCADE"), nullable=False
    )

    # Relationship with Admin (Fix)
    admin = relationship("Admin", back_populates="notifications")
