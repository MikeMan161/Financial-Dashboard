from app.models.models import Buckets, Users, Categories, Transactions
from app.schemas.bucket import BucketAllocation
from datetime import datetime, timezone
from fastapi import HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session
from decimal import Decimal

def get_bucket_spending(db: Session, current_user: Users) -> list[dict]:
    now = datetime.now(timezone.utc)
    start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    buckets = db.query(Buckets).filter(Buckets.user_id == current_user.id).order_by(Buckets.created_at).all()
    
    spending_rows = db.query(
        Categories.bucket_id,
        func.sum(Transactions.amount).label("spent")
    ).join(
        Categories, Transactions.category_id == Categories.id
    ).filter(
        Transactions.user_id == current_user.id,
        Transactions.transaction_date >= start,
        Transactions.deleted_at.is_(None),
    ).group_by(Categories.bucket_id).all()
    
    spending = dict(spending_rows)
    
    result = []
    for bucket in buckets:
        spent = spending.get(bucket.id, Decimal(0))
        limit = current_user.monthly_income * (bucket.target_percentage / 100)
        result.append({
            "id": bucket.id,
            "user_id": bucket.user_id,
            "name": bucket.name,
            "bucket_type": bucket.bucket_type,
            "target_percentage": bucket.target_percentage,
            "alert_threshold": bucket.alert_threshold,
            "created_at": bucket.created_at,
            "updated_at": bucket.updated_at,
            "spent": spent,
            "limit": limit
        })
    return result

def update_bucket_plan(
        db: Session,
        current_user: Users,
        allocations: list[BucketAllocation],
    ) -> list[dict]:
    """
    Apply a whole allocation plan at once. Every validation happens before the first
    mutation and there is exactly one commit at the end, so a rejected plan leaves the
    stored one untouched — no half-saved state for the user to untangle.
    """
    buckets = db.query(Buckets).filter(Buckets.user_id == current_user.id).all()
    by_id = {bucket.id: bucket for bucket in buckets}

    sent_ids = {allocation.id for allocation in allocations}
    owned_ids = set(by_id)

    # A bucket belonging to someone else is a 404, not a 403: the response must not
    # confirm that an id we don't own exists at all.
    if sent_ids - owned_ids:
        raise HTTPException(status_code=404, detail="Bucket not found")

    # The plan replaces the stored one wholesale, so a partial list would silently leave
    # the omitted buckets at their old values while reporting success.
    missing = owned_ids - sent_ids
    if missing:
        names = ", ".join(sorted(by_id[bucket_id].name for bucket_id in missing))
        raise HTTPException(
            status_code=400,
            detail=f"The plan must include every bucket. Missing: {names}",
        )

    # Assigning to a loaded ORM object stages the UPDATE in the session; nothing reaches
    # the database until the single commit below.
    for allocation in allocations:
        bucket = by_id[allocation.id]
        bucket.target_percentage = allocation.target_percentage
        bucket.alert_threshold = allocation.alert_threshold

    db.commit()

    # Return the recomputed plan so the caller doesn't need a follow-up GET to pick up
    # the new spent/limit figures.
    return get_bucket_spending(db, current_user)