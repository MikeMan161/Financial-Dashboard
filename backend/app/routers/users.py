from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import pycountry
from app.database import get_db
from app.dependencies import get_current_user
from app.models.models import Users
from app.schemas.user import UserResponse, UserInDB, Token, CurrencyUpdate, CurrencyInfo

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)

@router.get("/me", response_model=UserResponse)
async def get_user_me(current_user: Users = Depends(get_current_user)):
    return current_user

@router.get("/currencies", response_model=list[CurrencyInfo])
async def list_currencies():
    """Returns the full ISO 4217 currency list from pycountry for populating a currency picker."""
    currencies = [
        CurrencyInfo(code=currency.alpha_3, name=currency.name)
        for currency in pycountry.currencies
    ]
    return sorted(currencies, key=lambda c: c.name)

@router.patch("/me/currency", response_model=UserResponse)
async def update_currency(
    payload: CurrencyUpdate,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    current_user.currency = payload.currency
    db.commit()
    db.refresh(current_user)
    return current_user