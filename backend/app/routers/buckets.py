"""Read and update endpoints for budget buckets."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models.models import Users
from app.schemas.bucket import BucketPlanUpdate, BucketWithSpending
from uuid import UUID
from app.services.buckets import get_bucket_spending, update_bucket_plan

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

# PUT on the collection rather than PATCH per bucket: the four envelopes are a closed set,
# so the body is the entire plan, and updating them together is the only way to guarantee
# the user never ends up with a stored plan they didn't approve.
@router.put("", response_model=list[BucketWithSpending])
async def update_plan(
    payload: BucketPlanUpdate,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return update_bucket_plan(db, current_user, payload.buckets)
