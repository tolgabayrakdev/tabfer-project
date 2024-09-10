from sqlalchemy.orm import Session
from ..model import Ticket, User
from app.schema.ticket_schema import TicketCreate

class TicketService:
    @staticmethod
    def create_ticket(db: Session, ticket: TicketCreate, user_id: int):
        db_ticket = Ticket(
            subject=ticket.subject,
            message=ticket.message,
            user_id=user_id
        )
        db.add(db_ticket)
        db.commit()
        db.refresh(db_ticket)
        return db_ticket

    @staticmethod
    def get_user_tickets(db: Session, user_id: int):
        return db.query(Ticket).filter(Ticket.user_id == user_id).all()

    @staticmethod
    def get_all_tickets(db: Session):
        return db.query(Ticket).all()

    @staticmethod
    def get_ticket(db: Session, ticket_id: int):
        return db.query(Ticket).filter(Ticket.id == ticket_id).first()