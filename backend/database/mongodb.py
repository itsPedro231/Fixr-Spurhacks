from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
from typing import List, Optional, Dict
from models.user import UserCreate, UserInDB
from models.request import RequestCreate, RequestInDB
from models.technician import TechnicianCreate, TechnicianInDB
from bson import ObjectId
import json

# Custom JSON encoder to handle ObjectId
class MongoJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)

class MongoDB:
    def __init__(self):
        load_dotenv()
        self.mongo_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
        self.client = AsyncIOMotorClient(self.mongo_uri)
        self.db = self.client.fixnow_db
        self.users = self.db.users
        self.requests = self.db.requests
        self.technicians = self.db.technicians
    
    # User methods
    async def create_user(self, user: UserCreate) -> UserInDB:
        user_dict = user.dict()
        result = await self.users.insert_one(user_dict)
        user_dict["_id"] = str(result.inserted_id)
        return UserInDB(**user_dict)
    
    async def get_user(self, user_id: str) -> Optional[UserInDB]:
        user = await self.users.find_one({"_id": ObjectId(user_id)})
        if user:
            user["_id"] = str(user["_id"])
            return UserInDB(**user)
        return None
    
    # Request methods
    async def create_request(self, request: RequestCreate) -> RequestInDB:
        request_dict = request.dict()
        result = await self.requests.insert_one(request_dict)
        request_dict["_id"] = str(result.inserted_id)
        return RequestInDB(**request_dict)
    
    async def get_request(self, request_id: str) -> Optional[RequestInDB]:
        request = await self.requests.find_one({"_id": ObjectId(request_id)})
        if request:
            request["_id"] = str(request["_id"])
            return RequestInDB(**request)
        return None
    
    # Technician methods
    async def create_technician(self, technician: TechnicianCreate) -> TechnicianInDB:
        technician_dict = technician.dict()
        result = await self.technicians.insert_one(technician_dict)
        technician_dict["_id"] = str(result.inserted_id)
        return TechnicianInDB(**technician_dict)
    
    async def get_technician(self, technician_id: str) -> Optional[TechnicianInDB]:
        technician = await self.technicians.find_one({"_id": ObjectId(technician_id)})
        if technician:
            technician["_id"] = str(technician["_id"])
            return TechnicianInDB(**technician)
        return None
    
    async def get_all_technicians(self, problem_tag: Optional[str] = None) -> List[TechnicianInDB]:
        query = {}
        if problem_tag:
            query["services"] = {"$in": [problem_tag]}
        
        cursor = self.technicians.find(query)
        technicians = []
        async for technician in cursor:
            technician["_id"] = str(technician["_id"])
            technicians.append(TechnicianInDB(**technician))
        return technicians
    
    async def find_nearby_technicians(
        self, location: Dict[str, float], problem_tags: Optional[List[str]] = None, radius_km: float = 10.0
    ) -> List[TechnicianInDB]:
        # In a real application, you'd use MongoDB's geospatial queries
        # For hackathon purposes, we'll implement a simplified version
        
        query = {}
        if problem_tags:
            query["services"] = {"$in": problem_tags}
            
        # For now, just return all matching technicians
        # In production, you'd calculate distance and filter by radius
        cursor = self.technicians.find(query)
        technicians = []
        async for technician in cursor:
            technician["_id"] = str(technician["_id"])
            technicians.append(TechnicianInDB(**technician))
        return technicians

# Singleton instance
_mongodb = None

def get_database() -> MongoDB:
    global _mongodb
    if _mongodb is None:
        _mongodb = MongoDB()
    return _mongodb
