from pydantic import BaseModel
from uuid import UUID
from decimal import Decimal
from datetime import datetime


class SavingsGoalCreate(BaseModel):
    bucket_id: UUID
    name: str
    description: str | None = None
    target_amount: Decimal
    current_amount: Decimal = Decimal("0")
    due_date: datetime | None = None


class SavingsGoalResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: UUID
    user_id: UUID
    bucket_id: UUID
    name: str
    description: str | None
    target_amount: Decimal
    current_amount: Decimal
    due_date: datetime | None
    created_at: datetime
    updated_at: datetime
