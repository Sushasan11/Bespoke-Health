from pydantic import BaseModel
from typing import Optional


class DepartmentCreate(BaseModel):
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None


class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None


class DepartmentOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    image_url: Optional[str]

    class Config:
        from_attributes = True
