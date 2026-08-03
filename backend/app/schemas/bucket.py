"""
Pydantic schemas for budget buckets — the top-level spending categories users create
to allocate their income (e.g. 50% necessities, 30% wants, 20% savings). user_id is
excluded from BucketCreate so it is always assigned server-side from the authenticated
user and never trusted from the request body.
"""
from pydantic import BaseModel, field_serializer
from uuid import UUID
from decimal import Decimal
from datetime import datetime


class BucketCreate(BaseModel):
    name: str
    bucket_type: str
    target_percentage: Decimal
    alert_threshold: Decimal


class BucketResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: UUID
    user_id: UUID
    name: str
    bucket_type: str
    target_percentage: Decimal
    alert_threshold: Decimal
    created_at: datetime
    updated_at: datetime

    @field_serializer("target_percentage", "alert_threshold")
    def serialize_decimal(self, value: Decimal) -> float:
        return float(value)

class BucketWithSpending(BucketResponse):
    spent: float
    limit: float
