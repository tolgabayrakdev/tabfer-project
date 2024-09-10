from .database import Base
from sqlalchemy import Integer, String, Column, ForeignKey, Enum, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

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
    created_at = Column(DateTime, default=datetime.utcnow)

    role = relationship("Role")
    tickets = relationship("Ticket", back_populates="user")

class TicketStatus(enum.Enum):
    OPEN = "open"
    CLOSED = "closed"

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True)
    subject = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    status = Column(Enum(TicketStatus), default=TicketStatus.OPEN)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="tickets")

    responses = relationship("TicketResponse", back_populates="ticket")

class TicketResponse(Base):
    __tablename__ = "ticket_responses"

    id = Column(Integer, primary_key=True)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    ticket_id = Column(Integer, ForeignKey("tickets.id"))
    ticket = relationship("Ticket", back_populates="responses")
    
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User")