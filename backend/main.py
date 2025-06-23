from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router as api_router
import os

app = FastAPI(title="Fixr AI API", version="1.0.0")

# CORS configuration for production
origins = [
    "https://fixr-klkul3cce-sukhmans-projects-1d733bc6.vercel.app/auth",  # Replace with your Vercel URL
    "http://localhost:3000",
    "http://localhost:8081",
    "exp://localhost:8081"
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "OK", "service": "Fixr AI API"}
