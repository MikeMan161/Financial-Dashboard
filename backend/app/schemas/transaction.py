from pydantic import BaseModel
from uuid import UUID
from decimal import Decimal
from datetime import datetime


class TransactionCreate(BaseModel):
    category_id: UUID | None = None
    amount: Decimal
    description: str | None = None
    merchant: str | None = None
    transaction_date: datetime


class TransactionResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: UUID
    user_id: UUID
    category_id: UUID | None
    amount: Decimal
    description: str | None
    merchant: str | None
    transaction_date: datetime
    created_at: datetime
    updated_at: datetime
