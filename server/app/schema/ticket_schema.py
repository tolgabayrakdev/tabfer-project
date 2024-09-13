from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class TicketCreate(BaseModel):
    subject: str
    description: Optional[str] = None
    status: Optional[str] = "new"
    contact_id: int

class TicketUpdate(BaseModel):
    subject: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class TicketShow(BaseModel):
    id: int
    subject: str
    description: Optional[str] = None
    status: Optional[str] = "new"
    contact_id: int
    created_at: datetime
    updated_at: datetime

class TicketList(BaseModel):
    tickets: List[TicketShow]
