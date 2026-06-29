"""
Pydantic schemas for user-related API operations. Splitting into UserCreate,
UserResponse, and UserInDB ensures the hashed password is never returned in API
responses while still having a typed model for internal authentication logic.
Token holds the JWT shape returned by the login endpoint.
"""
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
    currency: str

class UserInDB(UserResponse):

    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str