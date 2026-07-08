"""CRUD endpoints for income records. Deletes are soft — deleted_at is stamped."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models.models import Income, Users
from app.schemas.income import IncomeCreate, IncomeResponse
from uuid import UUID
from datetime import datetime, timezone

router = APIRouter(
    prefix="/income",
    tags=["income"],
    responses={404: {"description": "Not found"}},
)

@router.post("", response_model=IncomeResponse)
async def create_income(
    payload: IncomeCreate,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    new_income = Income(
        user_id=current_user.id,
        amount=payload.amount,
        description=payload.description,
        source=payload.source,
        frequency=payload.frequency,
        income_date=payload.income_date,
    )
    db.add(new_income)
    db.commit()
    db.refresh(new_income)
    return new_income

@router.get("", response_model=list[IncomeResponse])
async def get_income(
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(Income).filter(
        Income.user_id == current_user.id,
        Income.deleted_at == None
    ).all()

@router.get("/deleted", response_model=list[IncomeResponse])
async def get_deleted_income(
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(Income).filter(
        Income.user_id == current_user.id,
        Income.deleted_at != None
    ).all()

@router.get("/{income_id}", response_model=IncomeResponse)
async def get_income_entry(
    income_id: UUID,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    income = db.query(Income).filter(
        Income.id == income_id,
        Income.user_id == current_user.id,
        Income.deleted_at == None
    ).first()
    if not income:
        raise HTTPException(status_code=404, detail="Income record not found")
    return income

@router.patch("/{income_id}", response_model=IncomeResponse)
async def update_income(
    income_id: UUID,
    payload: IncomeCreate,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    income = db.query(Income).filter(
        Income.id == income_id,
        Income.user_id == current_user.id,
        Income.deleted_at == None
    ).first()
    if not income:
        raise HTTPException(status_code=404, detail="Income record not found")

    income.amount = payload.amount
    income.description = payload.description
    income.source = payload.source
    income.frequency = payload.frequency
    income.income_date = payload.income_date
    db.commit()
    db.refresh(income)
    return income

@router.delete("/{income_id}", response_model=IncomeResponse)
async def delete_income(
    income_id: UUID,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    income = db.query(Income).filter(
        Income.id == income_id,
        Income.user_id == current_user.id,
        Income.deleted_at == None
    ).first()
    if not income:
        raise HTTPException(status_code=404, detail="Income record not found")

    income.deleted_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(income)
    return income
