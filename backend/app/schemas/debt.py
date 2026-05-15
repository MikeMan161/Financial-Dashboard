from pydantic import BaseModel
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
