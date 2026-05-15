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
