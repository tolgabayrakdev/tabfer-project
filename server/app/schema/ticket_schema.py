from pydantic import BaseModel
from datetime import datetime
from enum import Enum

class TicketStatus(str, Enum):
    OPEN = "open"
    CLOSED = "closed"

class TicketCreate(BaseModel):
    subject: str
    message: str

class TicketResponse(BaseModel):
    id: int
    subject: str
    message: str
    status: TicketStatus
    created_at: datetime
    updated_at: datetime
    user_id: int

    class Config:
        orm_mode = True