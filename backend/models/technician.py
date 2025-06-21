from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class TechnicianBase(BaseModel):
    user_id: str
    services: List[str]
    description: str
    hourly_rate: float
    location: Dict[str, float]  # {"lat": float, "lng": float}
    service_area_radius_km: float = 20.0
    ratings: Optional[float] = None
    review_count: Optional[int] = 0
    
class TechnicianCreate(TechnicianBase):
    pass

class TechnicianInDB(TechnicianBase):
    _id: str = Field(..., alias="_id")
    created_at: Optional[datetime] = None
    
class Technician(TechnicianBase):
    id: str
    distance_km: Optional[float] = None
    
    class Config:
        orm_mode = True
