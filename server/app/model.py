from .database import Base
from sqlalchemy import Integer, String, Column, ForeignKey, DateTime, Float, Text
from sqlalchemy.orm import relationship
from datetime import datetime


class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    role_id = Column(Integer, ForeignKey("roles.id"), default=1)
    created_at = Column(DateTime, default=datetime.now())
    role = relationship("Role")

    
class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    created_at = Column(DateTime, default=datetime.now())
    updated_at = Column(DateTime, default=datetime.now(), onupdate=datetime.now())

    user = relationship("User", back_populates="contacts")
    deals = relationship("Deal", back_populates="contact")
    tickets = relationship("Ticket", back_populates="contact")

class Deal(Base):
    __tablename__ = "deals"

    id = Column(Integer, primary_key=True)
    contact_id = Column(Integer, ForeignKey("contacts.id"))
    title = Column(String, nullable=False)
    amount = Column(Float)
    status = Column(String, default="open")
    created_at = Column(DateTime, default=datetime.now())
    updated_at = Column(DateTime, default=datetime.now(), onupdate=datetime.now())

    contact = relationship("Contact", back_populates="deals")

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True)
    contact_id = Column(Integer, ForeignKey("contacts.id"))
    subject = Column(String, nullable=False)
    description = Column(Text)
    status = Column(String, default="new")
    created_at = Column(DateTime, default=datetime.now())
    updated_at = Column(DateTime, default=datetime.now(), onupdate=datetime.now())

    contact = relationship("Contact", back_populates="tickets")
