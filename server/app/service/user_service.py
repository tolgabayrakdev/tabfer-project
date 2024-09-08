from sqlalchemy.orm import Session
from ..model import User
from app.schema.user_schema import UserUpdate, PasswordChange
from app.util.helper import Helper

helper = Helper()


class UserService:
    @staticmethod
    def update_profile(db: Session, user_id: int, user_update: UserUpdate):
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            for key, value in user_update.model_dump(exclude_unset=True).items():
                setattr(user, key, value)
            db.commit()
            db.refresh(user)
        return user

    @staticmethod
    def change_password(db: Session, user_id: int, password_change: PasswordChange):
        user = db.query(User).filter(User.id == user_id).first()
        if user and helper.match_hash_text(
            str(user.password), password_change.current_password
        ):
            user.password = helper.generate_hash_password(password_change.new_password) # type: ignore
            db.commit()
            return True
        return False

    @staticmethod
    def delete_account(db: Session, user_id: int):
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            db.delete(user)
            db.commit()
            return True
        return False
