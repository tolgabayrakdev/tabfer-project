from pydantic import BaseModel
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class DealCreate(BaseModel):
    title: str
    amount: Optional[float] = None
    status: Optional[str] = "open"
    contact_id: int

class DealUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    status: Optional[str] = None

class DealShow(BaseModel):
    id: int
    title: str
    amount: Optional[float] = None
    status: Optional[str] = "open"
    contact_id: int
    created_at: datetime
    updated_at: datetime

class DealList(BaseModel):
    deals: List[DealShow]