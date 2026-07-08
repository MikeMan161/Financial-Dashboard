"""CRUD endpoints for savings goals. Deletes are soft — deleted_at is stamped. Filterable by bucket via ?bucket_id."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models.models import SavingsGoals, Users
from app.schemas.savings_goal import SavingsGoalCreate, SavingsGoalResponse
from uuid import UUID
from datetime import datetime, timezone

router = APIRouter(
    prefix="/savings-goals",
    tags=["savings-goals"],
    responses={404: {"description": "Not found"}},
)

@router.post("", response_model=SavingsGoalResponse)
async def create_savings_goal(
    payload: SavingsGoalCreate,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    new_goal = SavingsGoals(
        user_id=current_user.id,
        bucket_id=payload.bucket_id,
        name=payload.name,
        description=payload.description,
        target_amount=payload.target_amount,
        current_amount=payload.current_amount,
        due_date=payload.due_date,
    )
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    return new_goal

@router.get("", response_model=list[SavingsGoalResponse])
async def get_savings_goals(
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
    bucket_id: UUID | None = None,
):
    query = db.query(SavingsGoals).filter(
        SavingsGoals.user_id == current_user.id,
        SavingsGoals.deleted_at == None
    )
    if bucket_id:
        query = query.filter(SavingsGoals.bucket_id == bucket_id)
    return query.all()

@router.get("/deleted", response_model=list[SavingsGoalResponse])
async def get_deleted_savings_goals(
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(SavingsGoals).filter(
        SavingsGoals.user_id == current_user.id,
        SavingsGoals.deleted_at != None
    ).all()

@router.get("/{goal_id}", response_model=SavingsGoalResponse)
async def get_savings_goal(
    goal_id: UUID,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    goal = db.query(SavingsGoals).filter(
        SavingsGoals.id == goal_id,
        SavingsGoals.user_id == current_user.id,
        SavingsGoals.deleted_at == None
    ).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Savings goal not found")
    return goal

@router.patch("/{goal_id}", response_model=SavingsGoalResponse)
async def update_savings_goal(
    goal_id: UUID,
    payload: SavingsGoalCreate,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    goal = db.query(SavingsGoals).filter(
        SavingsGoals.id == goal_id,
        SavingsGoals.user_id == current_user.id,
        SavingsGoals.deleted_at == None
    ).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Savings goal not found")

    goal.bucket_id = payload.bucket_id
    goal.name = payload.name
    goal.description = payload.description
    goal.target_amount = payload.target_amount
    goal.current_amount = payload.current_amount
    goal.due_date = payload.due_date
    db.commit()
    db.refresh(goal)
    return goal

@router.delete("/{goal_id}", response_model=SavingsGoalResponse)
async def delete_savings_goal(
    goal_id: UUID,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    goal = db.query(SavingsGoals).filter(
        SavingsGoals.id == goal_id,
        SavingsGoals.user_id == current_user.id,
        SavingsGoals.deleted_at == None
    ).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Savings goal not found")

    goal.deleted_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(goal)
    return goal
