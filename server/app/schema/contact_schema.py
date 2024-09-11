from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ContactCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None

class ContactUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

class ContactShow(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class ContactList(BaseModel):
    contacts: List[ContactShow]
