"""
Pydantic schemas for budget buckets — the four fixed envelopes every account is seeded
with at registration (see services/seeding.py). Users cannot create or delete buckets,
so there is no create schema here: the set is closed, and BucketUpdate covers the only
fields they may change.
"""
from pydantic import BaseModel, Field, field_serializer
from uuid import UUID
from decimal import Decimal
from datetime import datetime


class BucketUpdate(BaseModel):
    """
    The only bucket fields a user may change. name and bucket_type are omitted on
    purpose: the four envelopes are seeded at registration and fixed for the life of
    the account, so bucket_type is the app's stable handle on "this is the investments
    envelope" and must not drift. Percentages are bounded per-bucket but their sum is
    deliberately not constrained to 100 — an over- or under-allocated plan is allowed
    and surfaced to the user as a warning rather than blocked.
    """
    target_percentage: Decimal = Field(ge=0, le=100)
    alert_threshold: Decimal = Field(ge=0, le=100)


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
