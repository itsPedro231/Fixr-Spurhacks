from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class RequestBase(BaseModel):
    customer_id: str
    problem_description: str
    image_url: Optional[str] = None
    location: Dict[str, float]  # {"lat": float, "lng": float}
    problem_tags: List[str] = []
    ai_diagnosis: Optional[Dict[str, Any]] = None

class RequestCreate(RequestBase):
    created_at: datetime

class RequestInDB(RequestBase):
    _id: str = Field(..., alias="_id")
    created_at: datetime
    
class Request(RequestBase):
    id: str
    created_at: datetime
    recommended_technicians: Optional[List[Dict[str, Any]]] = []
    
    class Config:
        orm_mode = True
