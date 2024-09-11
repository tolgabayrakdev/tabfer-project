from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from ..model import Ticket
from app.schema.ticket_schema import TicketCreate, TicketUpdate, TicketShow
from typing import List, Any
from fastapi import HTTPException, status


class TicketService:

    @staticmethod
    def create(db: Session, data: TicketCreate) -> Ticket:
        try:
            new_ticket = Ticket(
                subject=data.subject,
                description=data.description,
                status=data.status,
                contact_id=data.contact_id,
            )
            db.add(new_ticket)
            db.commit()
            db.refresh(new_ticket)
            return new_ticket
        except SQLAlchemyError as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"An error occurred while creating the ticket: {str(e)}",
            )

    @staticmethod
    def get_by_id(db: Session, ticket_id: int) -> Ticket:
        try:
            ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
            if not ticket:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Ticket with id {ticket_id} not found",
                )
            return ticket
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"An error occurred while fetching the ticket: {str(e)}",
            )

    @staticmethod
    def get_all(db: Session) -> List[Any]:
        try:
            return db.query(Ticket).all()
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"An error occurred while fetching all tickets: {str(e)}",
            )

    @staticmethod
    def update(db: Session, ticket_id: int, data: TicketUpdate) -> Ticket:
        try:
            ticket = TicketService.get_by_id(db, ticket_id)
            for key, value in data.model_dump(exclude_unset=True).items():
                setattr(ticket, key, value)
            db.commit()
            db.refresh(ticket)
            return ticket
        except SQLAlchemyError as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"An error occurred while updating the ticket: {str(e)}",
            )

    @staticmethod
    def delete(db: Session, ticket_id: int) -> None:
        try:
            ticket = TicketService.get_by_id(db, ticket_id)
            db.delete(ticket)
            db.commit()
        except SQLAlchemyError as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"An error occurred while deleting the ticket: {str(e)}",
            )
