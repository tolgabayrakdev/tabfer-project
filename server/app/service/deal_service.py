from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from ..model import Deal
from app.schema.deal_schema import DealCreate, DealUpdate, DealShow
from typing import List
from fastapi import HTTPException, status


class DealService:

    @staticmethod
    def create(db: Session, data: DealCreate) -> Deal:
        try:
            new_deal = Deal(
                title=data.title,
                amount=data.amount,
                status=data.status,
                contact_id=data.contact_id,
            )
            db.add(new_deal)
            db.commit()
            db.refresh(new_deal)
            return new_deal
        except SQLAlchemyError as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"An error occurred while creating the deal: {str(e)}",
            )

    @staticmethod
    def get_by_id(db: Session, deal_id: int) -> Deal:
        try:
            deal = db.query(Deal).filter(Deal.id == deal_id).first()
            if not deal:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Deal with id {deal_id} not found",
                )
            return deal
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"An error occurred while fetching the deal: {str(e)}",
            )

    @staticmethod
    def get_all(db: Session) -> List[Deal]:
        try:
            return db.query(Deal).all()
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"An error occurred while fetching all deals: {str(e)}",
            )

    @staticmethod
    def update(db: Session, deal_id: int, data: DealUpdate) -> Deal:
        try:
            deal = DealService.get_by_id(db, deal_id)
            for key, value in data.model_dump(exclude_unset=True).items():
                setattr(deal, key, value)
            db.commit()
            db.refresh(deal)
            return deal
        except SQLAlchemyError as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"An error occurred while updating the deal: {str(e)}",
            )

    @staticmethod
    def delete(db: Session, deal_id: int) -> None:
        try:
            deal = DealService.get_by_id(db, deal_id)
            db.delete(deal)
            db.commit()
        except SQLAlchemyError as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"An error occurred while deleting the deal: {str(e)}",
            )
