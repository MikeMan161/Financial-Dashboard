"""
Pydantic schemas for debt records. Capturing balance, APR, and minimum payment as
structured fields gives the AI layer the data it needs to generate payoff timelines
and recommendations rather than parsing them from free text.
"""
from pydantic import BaseModel, field_serializer
from uuid import UUID
from decimal import Decimal
from datetime import datetime


class DebtCreate(BaseModel):
    name: str
    current_balance: Decimal
    apr: Decimal
    minimum_payment: Decimal
    due_date: datetime


class DebtResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: UUID
    user_id: UUID
    name: str
    current_balance: Decimal
    apr: Decimal
    minimum_payment: Decimal
    due_date: datetime
    created_at: datetime
    updated_at: datetime

    @field_serializer("current_balance", "apr", "minimum_payment")
    def serialize_decimal(self, value: Decimal) -> float:
        return float(value)
