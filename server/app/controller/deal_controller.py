from fastapi import APIRouter, Depends, status
from app.schema.deal_schema import DealCreate, DealUpdate, DealShow
from sqlalchemy.orm import Session
from app.service.deal_service import DealService
from ..database import get_db
from typing import List

router = APIRouter()

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=DealShow)
def create_deal(deal: DealCreate, db: Session = Depends(get_db)):
    return DealService.create(db, deal)

@router.get("/{deal_id}", response_model=DealShow)
def get_deal(deal_id: int, db: Session = Depends(get_db)):
    return DealService.get_by_id(db, deal_id)

@router.get("/", response_model=List[DealShow])
def get_all_deals(db: Session = Depends(get_db)):
    return DealService.get_all(db)

@router.put("/{deal_id}", response_model=DealShow)
def update_deal(deal_id: int, deal: DealUpdate, db: Session = Depends(get_db)):
    return DealService.update(db, deal_id, deal)

@router.delete("/{deal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_deal(deal_id: int, db: Session = Depends(get_db)):
    DealService.delete(db, deal_id)