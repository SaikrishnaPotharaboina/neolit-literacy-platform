from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, ConfigDict


class UserBase(BaseModel):
    name: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    level: int = 1
    xp: int = 0
    streak: int = 0
    created_at: datetime
    updated_at: Optional[datetime] = None


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
