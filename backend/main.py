from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router as api_router
import os

app = FastAPI(title="Fixr AI API", version="1.0.0")

# CORS configuration for production
origins = [
    "https://fixr-eta.vercel.app",  # Your actual Vercel URL
    "https://fixr-klkul3cce-sukhmans-projects-1d733bc6.vercel.app",
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

# Root endpoint for keep-alive (supports both GET and HEAD)
@app.get("/")
@app.head("/")
async def root():
    return {"message": "Fixr AI API is running", "status": "OK"}

app.include_router(api_router)

# Health check endpoint (supports both GET and HEAD)
@app.get("/health")
@app.head("/health")
async def health_check():
    return {"status": "OK", "service": "Fixr AI API"}
