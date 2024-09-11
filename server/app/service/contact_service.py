from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from ..model import Contact
from app.schema.contact_schema import (
    ContactCreate,
    ContactShow,
    ContactList,
    ContactUpdate,
)
from typing import List, Any
from fastapi import HTTPException, status


class ContactService:

    @staticmethod
    def create(db: Session, data: ContactCreate, user_id: int) -> Contact:
        try:
            new_contact = Contact(
                first_name=data.first_name,
                last_name=data.last_name,
                email=data.email,
                phone=data.phone,
                user_id=user_id
            )
            db.add(new_contact)
            db.commit()
            db.refresh(new_contact)
            return new_contact
        except SQLAlchemyError as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"An error occurred while creating the contact: {str(e)}",
            )

    @staticmethod
    def get_all(db: Session, user_id: int) -> List[Any]:
        try:
            return db.query(Contact).filter(Contact.user_id == user_id).all()
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"An error occurred while fetching contacts: {str(e)}",
            )

    @staticmethod
    def get_by_id(db: Session, contact_id: int, user_id: int) -> Contact:
        contact = db.query(Contact).filter(Contact.id == contact_id, Contact.user_id == user_id).first()
        if not contact:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Contact with id {contact_id} not found",
            )
        return contact

    @staticmethod
    def update(db: Session, contact_id: int, data: ContactUpdate, user_id: int) -> Contact:
        contact = ContactService.get_by_id(db, contact_id, user_id)
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(contact, key, value)
        try:
            db.commit()
            db.refresh(contact)
            return contact
        except SQLAlchemyError as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"An error occurred while updating the contact: {str(e)}",
            )

    @staticmethod
    def delete(db: Session, contact_id: int, user_id: int) -> None:
        contact = ContactService.get_by_id(db, contact_id, user_id)
        try:
            db.delete(contact)
            db.commit()
        except SQLAlchemyError as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"An error occurred while deleting the contact: {str(e)}",
            )
