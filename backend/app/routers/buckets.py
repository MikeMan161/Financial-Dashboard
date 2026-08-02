"""CRUD endpoints for budget buckets."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models.models import Buckets, Users, Categories, Transactions
from app.schemas.bucket import BucketCreate, BucketResponse, BucketWithSpending
from uuid import UUID
from datetime import datetime, timezone
from sqlalchemy import func
from app.services.buckets import get_bucket_spending

router = APIRouter(
    prefix="/buckets",
    tags=["buckets"],
    responses={404: {"description": "Not found"}},

)

@router.get("", response_model=list[BucketWithSpending])
async def get_user_buckets(current_user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_bucket_spending(db, current_user)
    


@router.get("/{bucket_id}", response_model=BucketWithSpending)
async def get_bucket(bucket_id: UUID, current_user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    buckets = get_bucket_spending(db, current_user)
    for bucket in buckets:
        if bucket["id"] == bucket_id:
            return bucket
    raise HTTPException(status_code=404, detail="Bucket not found")

@router.post("", response_model=BucketResponse)
async def create_bucket(
    payload: BucketCreate,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    new_bucket = Buckets(
        user_id=current_user.id,
        name=payload.name,
        bucket_type=payload.bucket_type,
        target_percentage=payload.target_percentage,
        alert_threshold=payload.alert_threshold,
    )
    db.add(new_bucket)
    db.commit()
    db.refresh(new_bucket)
    return new_bucket

@router.patch("/{bucket_id}", response_model=BucketResponse)
async def update_bucket(
    bucket_id: UUID,
    payload: BucketCreate,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    bucket = db.query(Buckets).filter(Buckets.id == bucket_id, Buckets.user_id == current_user.id).first()
    if not bucket:
        raise HTTPException(status_code=404, detail="Bucket not found")
    
    bucket.name = payload.name
    bucket.bucket_type = payload.bucket_type
    bucket.target_percentage = payload.target_percentage
    bucket.alert_threshold = payload.alert_threshold

    db.commit()
    db.refresh(bucket)
    return bucket

@router.delete("/{bucket_id}", response_model=dict)
async def delete_bucket(
    bucket_id: UUID,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    bucket = db.query(Buckets).filter(Buckets.id == bucket_id, Buckets.user_id == current_user.id).first()
    if not bucket:
        raise HTTPException(status_code=404, detail="Bucket not found")
    
    db.delete(bucket)
    db.commit()
    return {"message": "Bucket deleted successfully"}