from app.models.models import Buckets, Categories

DEFAULT_BUCKETS = [
    ("Fixed Costs", "fixed_costs", 55, [
        "Rent/Mortgage", "Utilities", "Internet & Phone", "Groceries",
        "Transportation", "Insurance", "Debt Payments", "Subscriptions",
    ]),
    ("Investments", "investments", 10, [
        "401(k)", "Roth IRA", "Brokerage",
    ]),
    ("Savings", "savings", 10, [
        "Emergency Fund", "Vacation", "Big Purchases", "Gifts",
    ]),
    ("Guilt-Free Spending", "guilt_free", 25, [
        "Dining Out", "Entertainment", "Shopping", "Hobbies", "Travel", "Fitness",
    ]),
]
assert sum(pct for _, _, pct, _ in DEFAULT_BUCKETS) == 100
DEFAULT_ALERT_THRESHOLD = 80



def seed_default_buckets(db, user): 
    pairs = []
    for name, bucket_type, pct, category_names in DEFAULT_BUCKETS:
        bucket = Buckets(
            user_id=user.id,
            name=name,
            bucket_type=bucket_type,
            target_percentage=pct,
            alert_threshold=DEFAULT_ALERT_THRESHOLD
        )
        db.add(bucket)
        pairs.append((bucket,category_names))
    db.flush()
    for bucket, category_names in pairs:
        for category_name in category_names:
            db.add(Categories(user_id=user.id, bucket_id=bucket.id, name=category_name))

