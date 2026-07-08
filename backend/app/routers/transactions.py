"""CRUD endpoints for transactions. Deletes are soft — deleted_at is stamped. Filterable by category via ?category_id."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models.models import Transactions, Users
from app.schemas.transaction import TransactionCreate, TransactionResponse
from uuid import UUID
from datetime import datetime, timezone

router = APIRouter(
    prefix="/transactions",
    tags=["transactions"],
    responses={404: {"description": "Not found"}},
)

@router.post("", response_model=TransactionResponse)
async def transaction_create(
    payload: TransactionCreate,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_transaction = Transactions(
        user_id=current_user.id,
        category_id=payload.category_id,
        amount=payload.amount,
        description=payload.description,
        merchant=payload.merchant,
        transaction_date=payload.transaction_date,
    )
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    return new_transaction

@router.get("", response_model=list[TransactionResponse])
async def get_transactions(
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
    category_id: UUID | None = None,
):
    query = db.query(Transactions).filter(
        Transactions.user_id == current_user.id,
        Transactions.deleted_at == None
    )
    if category_id:
        query = query.filter(Transactions.category_id == category_id)
    return query.all()

@router.get("/deleted", response_model=list[TransactionResponse])
async def get_deleted_transactions(
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(Transactions).filter(
        Transactions.user_id == current_user.id,
        Transactions.deleted_at != None
    ).all()

@router.get("/{transaction_id}", response_model=TransactionResponse)
async def get_transaction(
    transaction_id: UUID,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    transaction = db.query(Transactions).filter(
        Transactions.id == transaction_id,
        Transactions.user_id == current_user.id,
        Transactions.deleted_at == None
    ).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction

@router.patch("/{transaction_id}", response_model=TransactionResponse)
async def update_transaction(
    transaction_id: UUID,
    payload: TransactionCreate,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    transaction = db.query(Transactions).filter(
        Transactions.id == transaction_id,
        Transactions.user_id == current_user.id,
        Transactions.deleted_at == None
    ).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    transaction.category_id = payload.category_id
    transaction.amount = payload.amount
    transaction.description = payload.description
    transaction.merchant = payload.merchant
    transaction.transaction_date = payload.transaction_date
    db.commit()
    db.refresh(transaction)
    return transaction

@router.delete("/{transaction_id}", response_model=TransactionResponse)
async def delete_transaction(
    transaction_id: UUID,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    transaction = db.query(Transactions).filter(
        Transactions.id == transaction_id,
        Transactions.user_id == current_user.id,
        Transactions.deleted_at == None
    ).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    transaction.deleted_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(transaction)
    return transaction
