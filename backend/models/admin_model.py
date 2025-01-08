from sqlalchemy import Column, Integer, String, Boolean, LargeBinary
from database import Base
from sqlalchemy.orm import relationship


class Admin(Base):
    __tablename__ = "admin"

    email = Column(String, unique=True, index=True)
    password = Column(String)
