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
