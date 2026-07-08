"""
Pydantic schemas for user-related API operations. Splitting into UserCreate,
UserResponse, and UserInDB ensures the hashed password is never returned in API
responses while still having a typed model for internal authentication logic.
Token holds the JWT shape returned by the login endpoint. CurrencyUpdate validates
against pycountry's ISO 4217 list instead of a hand-typed set of codes, so the
accepted currencies stay correct as the standard changes.
"""
from pydantic import BaseModel, EmailStr, field_validator
from uuid import UUID
from datetime import datetime
from app.auth import hash_password
import pycountry

def _validate_currency_code(value: str) -> str:
    code = value.upper()
    if pycountry.currencies.get(alpha_3=code) is None:
        raise ValueError(f"'{value}' is not a valid ISO 4217 currency code")
    return code

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    currency: str = "USD"

    @field_validator("currency")
    @classmethod
    def validate_currency(cls, value: str) -> str:
        return _validate_currency_code(value)

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

class CurrencyUpdate(BaseModel):
    currency: str

    @field_validator("currency")
    @classmethod
    def validate_currency(cls, value: str) -> str:
        return _validate_currency_code(value)

class CurrencyInfo(BaseModel):
    code: str
    name: str

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

class MessageResponse(BaseModel):
    message: str


    