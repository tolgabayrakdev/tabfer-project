.from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from app.service.ticket_service import TicketService
from ..schemas.ticket import TicketCreate, TicketResponse
from ..auth.jwt_bearer import JWTBearer
from ..auth.jwt_handler import decode_jwt

router = APIRouter()

@router.post("/", response_model=TicketResponse, dependencies=[Depends(JWTBearer())])
def create_ticket(ticket: TicketCreate, db: Session = Depends(get_db), token: str = Depends(JWTBearer())):
    user_id = decode_jwt(token)["user_id"]
    return TicketService.create_ticket(db, ticket, user_id)

@router.get("/user", response_model=list[TicketResponse], dependencies=[Depends(JWTBearer())])
def get_user_tickets(db: Session = Depends(get_db), token: str = Depends(JWTBearer())):
    user_id = decode_jwt(token)["user_id"]
    return TicketService.get_user_tickets(db, user_id)

@router.get("/all", response_model=list[TicketResponse], dependencies=[Depends(JWTBearer())])
def get_all_tickets(db: Session = Depends(get_db)):
    return TicketService.get_all_tickets(db)

@router.get("/{ticket_id}", response_model=TicketResponse, dependencies=[Depends(JWTBearer())])
def get_ticket(ticket_id: int, db: Session = Depends(get_db)):
    ticket = TicketService.get_ticket(db, ticket_id)
    if ticket is None:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket