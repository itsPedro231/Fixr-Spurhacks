from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    from api.routes import router as api_router
    logger.info("Successfully imported API routes")
except ImportError as e:
    logger.error(f"Failed to import API routes: {e}")
    raise

app = FastAPI(title="Fixr AI API", version="1.0.0")

# CORS configuration for production
origins = [
    "https://your-vercel-app.vercel.app",  # Replace with your Vercel URL
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

try:
    app.include_router(api_router)
    logger.info("Successfully included API router")
except Exception as e:
    logger.error(f"Failed to include API router: {e}")
    raise

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "OK", "service": "Fixr AI API"}

# Environment check endpoint
@app.get("/env-check")
async def env_check():
    env_vars = {
        "GOOGLE_API_KEY": bool(os.getenv("GOOGLE_API_KEY")),
        "MONGODB_URI": bool(os.getenv("MONGODB_URI")),
        "OPENAI_API_KEY": bool(os.getenv("OPENAI_API_KEY"))
    }
    return {"environment_variables": env_vars}
