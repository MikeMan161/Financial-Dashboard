from app.models.models import Buckets, Users, Categories, Transactions
from datetime import datetime, timezone
from sqlalchemy import func
from sqlalchemy.orm import Session
from decimal import Decimal

def get_bucket_spending(db: Session, current_user: Users) -> list[dict]:
    now = datetime.now(timezone.utc)
    start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    buckets = db.query(Buckets).filter(Buckets.user_id == current_user.id).all()
    
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