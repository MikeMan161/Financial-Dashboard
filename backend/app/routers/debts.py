"""CRUD endpoints for debt records. Deletes are soft — deleted_at is stamped."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models.models import Debts, Users
from app.schemas.debt import DebtCreate, DebtResponse
from uuid import UUID
from datetime import datetime, timezone

router = APIRouter(
    prefix="/debts",
    tags=["debts"],
    responses={404: {"description": "Not found"}},
)

@router.post("", response_model=DebtResponse)
async def create_debt(
    payload: DebtCreate,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    new_debt = Debts(
        user_id=current_user.id,
        name=payload.name,
        current_balance=payload.current_balance,
        apr=payload.apr,
        minimum_payment=payload.minimum_payment,
        due_date=payload.due_date,
    )
    db.add(new_debt)
    db.commit()
    db.refresh(new_debt)
    return new_debt

@router.get("", response_model=list[DebtResponse])
async def get_debts(
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(Debts).filter(
        Debts.user_id == current_user.id,
        Debts.deleted_at == None
    ).all()

@router.get("/deleted", response_model=list[DebtResponse])
async def get_deleted_debts(
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(Debts).filter(
        Debts.user_id == current_user.id,
        Debts.deleted_at != None
    ).all()

@router.get("/{debt_id}", response_model=DebtResponse)
async def get_debt(
    debt_id: UUID,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    debt = db.query(Debts).filter(
        Debts.id == debt_id,
        Debts.user_id == current_user.id,
        Debts.deleted_at == None
    ).first()
    if not debt:
        raise HTTPException(status_code=404, detail="Debt not found")
    return debt

@router.patch("/{debt_id}", response_model=DebtResponse)
async def update_debt(
    debt_id: UUID,
    payload: DebtCreate,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    debt = db.query(Debts).filter(
        Debts.id == debt_id,
        Debts.user_id == current_user.id,
        Debts.deleted_at == None
    ).first()
    if not debt:
        raise HTTPException(status_code=404, detail="Debt not found")

    debt.name = payload.name
    debt.current_balance = payload.current_balance
    debt.apr = payload.apr
    debt.minimum_payment = payload.minimum_payment
    debt.due_date = payload.due_date
    db.commit()
    db.refresh(debt)
    return debt

@router.delete("/{debt_id}", response_model=DebtResponse)
async def delete_debt(
    debt_id: UUID,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    debt = db.query(Debts).filter(
        Debts.id == debt_id,
        Debts.user_id == current_user.id,
        Debts.deleted_at == None
    ).first()
    if not debt:
        raise HTTPException(status_code=404, detail="Debt not found")

    debt.deleted_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(debt)
    return debt
