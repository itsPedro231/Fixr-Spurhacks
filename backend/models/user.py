from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import datetime

class UserType(str, Enum):
    CUSTOMER = "customer"
    TECHNICIAN = "technician"

class UserBase(BaseModel):
    email: str
    name: str
    phone: str
    user_type: UserType
    
class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    _id: str = Field(..., alias="_id")
    created_at: Optional[datetime] = None

class User(UserBase):
    id: str
    
    class Config:
        orm_mode = True
