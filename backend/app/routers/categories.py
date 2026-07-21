"""CRUD endpoints for transaction categories. Filterable by bucket via ?bucket_id."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models.models import Categories, Users, Buckets
from app.schemas.category import CategoryCreate, CategoryResponse
from uuid import UUID
from app.schemas.user import MessageResponse

router = APIRouter (
    prefix= "/categories",
    tags= ["categories"],
    responses= {404: {"description": "Not found"}},
)

@router.post("", response_model=CategoryResponse)
async def category_create(
    payload: CategoryCreate,
    current_user: Users = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    new_category = Categories(
        bucket_id = payload.bucket_id,
        name = payload.name,
        user_id = current_user.id
    )
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category
    

@router.get("", response_model=list[CategoryResponse])
async def get_user_categories (
    current_user: Users = Depends(get_current_user), 
    db: Session = Depends(get_db),        
    bucket_id: UUID | None = None
    ):        
    query = db.query(Categories).filter(current_user.id == Categories.user_id)  
    if bucket_id:            
        query = query.filter(Categories.bucket_id == bucket_id)
    return query.all()

@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category (
    category_id: UUID,
    current_user: Users = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    category = db.query(Categories).filter(current_user.id == Categories.user_id, Categories.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router.patch("/{category_id}", response_model=CategoryResponse)
async def update_category (
    category_id: UUID,
    payload: CategoryCreate,
    current_user: Users = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    tempVar = db.query(Categories).filter(current_user.id == Categories.user_id, category_id == Categories.id).first()
    if not tempVar:
        raise HTTPException(status_code=404, detail="Category not found")
    
    verifyBucket = db.query(Buckets).filter(current_user.id == Buckets.user_id, Buckets.id == payload.Buckets_id).first()
    if not verifyBucket:
        raise HTTPException(status_code=404, detail="Bucket not found")
    
    tempVar.bucket_id = payload.bucket_id
    tempVar.name = payload.name
    db.commit()
    db.refresh(tempVar)
    return tempVar

@router.delete("/{category_id}", response_model=MessageResponse)
async def delete_category(
    category_id: UUID,
    current_user: Users= Depends(get_current_user), 
    db: Session= Depends(get_db)
    ):
    temp = db.query(Categories).filter(current_user.id == Categories.user_id, Categories.id == category_id).first()
    if not temp:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(temp)
    db.commit()
    return {"message": "Category deleted successfully"}
