"""
Pydantic schemas for income records. frequency is kept as a plain string rather than
an enum to stay flexible as the AI layer learns to parse natural-language income
descriptions (e.g. "biweekly", "twice a month") without requiring a schema change.
"""
from pydantic import BaseModel, field_serializer
from uuid import UUID
from decimal import Decimal
from datetime import datetime


class IncomeCreate(BaseModel):
    amount: Decimal
    description: str | None = None
    source: str | None = None
    frequency: str
    income_date: datetime


class IncomeResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: UUID
    user_id: UUID
    amount: Decimal
    description: str | None
    source: str | None
    frequency: str
    income_date: datetime
    created_at: datetime
    updated_at: datetime

    @field_serializer("amount")
    def serialize_decimal(self, value: Decimal) -> float:
        return float(value)
