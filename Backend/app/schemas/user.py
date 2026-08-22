from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserCreate(BaseModel):
    first_name: str | None = Field(default=None, min_length=1, max_length=80)
    last_name: str = Field(default="", max_length=80)
    name: str | None = Field(default=None, max_length=160)
    email: EmailStr
    password: str = Field(min_length=8)

    def names(self) -> tuple[str, str]:
        if self.first_name:
            return self.first_name.strip(), self.last_name.strip()
        parts = (self.name or "").strip().split(maxsplit=1)
        return parts[0], parts[1] if len(parts) > 1 else ""

class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    created_at: datetime
    updated_at: datetime | None = None


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
