from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
import uvicorn
import os
from dotenv import load_dotenv
import base64
import json
from datetime import datetime

# Import our custom modules
from database.mongodb import get_database
from models.user import User, UserCreate, UserInDB, UserType
from models.request import Request, RequestCreate
from models.technician import Technician, TechnicianCreate
from ai.gemini_service import analyze_image
from ai.openai_service import diagnose_with_gpt
from services.technician_service import find_nearby_technicians

# Load environment variables
load_dotenv()

app = FastAPI(title="FixNow API", description="AI-powered service provider app")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
@app.get("/")
async def root():
    return {"message": "Welcome to FixNow API - connecting you with service providers"}

# User routes
@app.post("/api/users", response_model=User)
async def create_user(user: UserCreate):
    db = get_database()
    return await db.create_user(user)

@app.get("/api/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    db = get_database()
    user = await db.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Request routes
@app.post("/api/requests", response_model=Request)
async def create_request(
    problem_description: str = Form(...),
    customer_id: str = Form(...),
    image: Optional[UploadFile] = File(None),
    location: Dict[str, float] = Form(...),
):
    db = get_database()
    
    # Process image if available
    image_analysis = None
    problem_tags = []
    
    if image:
        # Save image to storage or convert to base64
        image_content = await image.read()
        image_b64 = base64.b64encode(image_content).decode('utf-8')
        
        # Analyze with Gemini
        try:
            image_analysis = await analyze_image(image_b64)
            problem_tags = image_analysis.get("tags", [])
        except Exception as e:
            print(f"Error analyzing image: {str(e)}")
    
    # Diagnose with ChatGPT
    ai_diagnosis = await diagnose_with_gpt(
        description=problem_description,
        image_analysis=image_analysis
    )
    
    # Create request in database
    request_data = RequestCreate(
        customer_id=customer_id,
        problem_description=problem_description,
        image_url=None,  # would store URL if we're saving images
        location=location,
        problem_tags=problem_tags,
        ai_diagnosis=ai_diagnosis,
        created_at=datetime.now()
    )
    
    request = await db.create_request(request_data)
    
    # Find nearby technicians
    nearby_technicians = await find_nearby_technicians(
        location=location,
        problem_tags=problem_tags
    )
    
    # Return the request with recommended technicians
    return {**request.dict(), "recommended_technicians": nearby_technicians}

@app.get("/api/requests/{request_id}", response_model=Request)
async def get_request(request_id: str):
    db = get_database()
    request = await db.get_request(request_id)
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    return request

# Technician routes
@app.post("/api/technicians", response_model=Technician)
async def create_technician(technician: TechnicianCreate):
    db = get_database()
    return await db.create_technician(technician)

@app.get("/api/technicians", response_model=List[Technician])
async def get_technicians(
    problem_tag: Optional[str] = None,
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    radius_km: float = 10.0
):
    db = get_database()
    if lat and lng:
        location = {"lat": lat, "lng": lng}
        technicians = await find_nearby_technicians(location, [problem_tag] if problem_tag else None, radius_km)
        return technicians
    else:
        # Just return all technicians if no location provided
        return await db.get_all_technicians(problem_tag)

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
