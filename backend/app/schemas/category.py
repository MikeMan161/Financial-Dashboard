"""
Pydantic schemas for transaction categories, which live inside buckets and give
spending data its hierarchical structure. Requiring bucket_id at creation time
enforces that every category is explicitly tied to a budget bucket rather than
floating unassigned.
"""
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class CategoryCreate(BaseModel):
    bucket_id: UUID
    name: str
    is_default: bool = True


class CategoryResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: UUID
    user_id: UUID
    bucket_id: UUID
    name: str
    is_default: bool
    created_at: datetime
    updated_at: datetime
