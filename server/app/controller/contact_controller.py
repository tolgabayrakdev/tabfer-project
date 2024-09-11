from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.depend.authenticated_user import authenticated_user
from typing import List
from ..schema.contact_schema import ContactCreate, ContactShow, ContactList, ContactUpdate
from ..service.contact_service import ContactService
from ..database import get_db
from ..model import User

router = APIRouter()

@router.post("/contacts", response_model=ContactShow, status_code=status.HTTP_201_CREATED)
def create_contact(
    contact: ContactCreate, 
    db: Session = Depends(get_db), 
    current_user: dict = Depends(authenticated_user)
):
    return ContactService.create(db, contact, current_user["id"])

@router.get("/contacts", response_model=List[ContactList])
def get_all_contacts(
    db: Session = Depends(get_db), 
    current_user: User = Depends(authenticated_user)
):
    return ContactService.get_all(db, current_user["id"])

@router.get("/contacts/{contact_id}", response_model=ContactShow)
def get_contact(
    contact_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(authenticated_user)
):
    return ContactService.get_by_id(db, contact_id, current_user["id"])

@router.put("/contacts/{contact_id}", response_model=ContactShow)
def update_contact(
    contact_id: int, 
    contact: ContactUpdate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(authenticated_user)
):
    return ContactService.update(db, contact_id, contact, current_user["id"])

@router.delete("/contacts/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact(
    contact_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(authenticated_user)
):
    ContactService.delete(db, contact_id, current_user["id"])
    return {"message": "Contact deleted successfully"}