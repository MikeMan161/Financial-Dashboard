from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models.models import Buckets, Users
from app.schemas.bucket import BucketCreate, BucketResponse
from uuid import UUID

router = APIRouter(
    prefix="/buckets",
    tags=["buckets"],
    responses={404: {"description": "Not found"}},

)

@router.get("", response_model=list[BucketResponse])
async def get_user_buckets(current_user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Buckets).filter(Buckets.user_id == current_user.id).all()

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

@router.patch("/{bucket_id}", response_model=list[BucketResponse])
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