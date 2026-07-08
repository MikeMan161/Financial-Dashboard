"""Registration and login endpoints."""
from app.schemas.user import UserCreate, UserResponse, Token
from app.database import get_db
from app.models.models import Users
from app.auth import hash_password, create_access_token, verify_password
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter() 

@router.post("/auth/register", response_model=UserResponse) #endpoint for user registration
async def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(Users).filter(Users.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=409, detail="Email already registered")
        
    new_user = Users(
        username=user.username,
        email=user.email,
        password_hash=hash_password(user.password),
        currency=user.currency
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/auth/login", response_model=Token) #endpoint for user login
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(Users).filter(Users.email == form_data.username).first()
    if user is None or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    access_token = create_access_token(data={"sub": str(user.id)})
    return Token(access_token=access_token, token_type="bearer")