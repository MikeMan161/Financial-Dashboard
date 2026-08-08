"""
Pydantic schemas for budget buckets — the four fixed envelopes every account is seeded
with at registration (see services/seeding.py). Users cannot create or delete buckets,
so there is no create schema here: the set is closed, and the plan schemas below cover
the only fields they may change.
"""
from pydantic import BaseModel, Field, field_serializer, model_validator
from uuid import UUID
from decimal import Decimal
from datetime import datetime


class BucketAllocation(BaseModel):
    """
    One bucket's slice of the plan. name and bucket_type are omitted on purpose: the four
    envelopes are seeded at registration and fixed for the life of the account, so
    bucket_type is the app's stable handle on "this is the investments envelope" and must
    not drift. Percentages are bounded per-bucket but their sum is deliberately not
    constrained to 100 — an over- or under-allocated plan is allowed and surfaced to the
    user as a warning rather than blocked.
    """
    id: UUID
    target_percentage: Decimal = Field(ge=0, le=100)
    alert_threshold: Decimal = Field(ge=0, le=100)


class BucketPlanUpdate(BaseModel):
    """
    The whole allocation plan in one body, so all four buckets move in a single
    transaction and a rejected plan leaves the stored one untouched. Wrapped in an object
    rather than sent as a bare list so plan-level fields can be added later without
    changing the request shape.
    """
    buckets: list[BucketAllocation]

    @model_validator(mode="after")
    def no_duplicate_ids(self):
        """
        A repeated id would mean two conflicting values for one bucket, with the winner
        decided by list order. Checked here rather than in the service because it needs
        nothing from the database.
        """
        ids = {allocation.id for allocation in self.buckets}
        if len(ids) != len(self.buckets):
            raise ValueError("Each bucket may appear only once in the plan")
        return self


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
