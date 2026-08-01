"""
Pydantic schemas for budget buckets — the top-level spending categories users create
to allocate their income (e.g. 50% necessities, 30% wants, 20% savings). user_id is
excluded from BucketCreate so it is always assigned server-side from the authenticated
user and never trusted from the request body.
"""
from pydantic import BaseModel
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
    spent: float
