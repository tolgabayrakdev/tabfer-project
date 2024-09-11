from fastapi import APIRouter, Depends, status
from app.schema.ticket_schema import TicketCreate, TicketUpdate, TicketShow
from sqlalchemy.orm import Session
from app.service.ticket_service import TicketService
from ..database import get_db
from typing import List

router = APIRouter()

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=TicketShow)
def create_ticket(ticket: TicketCreate, db: Session = Depends(get_db)):
    return TicketService.create(db, ticket)

@router.get("/{ticket_id}", response_model=TicketShow)
def get_ticket(ticket_id: int, db: Session = Depends(get_db)):
    return TicketService.get_by_id(db, ticket_id)

@router.get("/", response_model=List[TicketShow])
def get_all_tickets(db: Session = Depends(get_db)):
    return TicketService.get_all(db)

@router.put("/{ticket_id}", response_model=TicketShow)
def update_ticket(ticket_id: int, ticket: TicketUpdate, db: Session = Depends(get_db)):
    return TicketService.update(db, ticket_id, ticket)

@router.delete("/{ticket_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_ticket(ticket_id: int, db: Session = Depends(get_db)):
    TicketService.delete(db, ticket_id)