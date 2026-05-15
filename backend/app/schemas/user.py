from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    currency: str = "USD"

class UserResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: UUID
    username: str
    email: EmailStr
    created_at: datetime

class UserInDB(UserResponse):
    model_config = {"from_attributes": True}

    hashed_password: str