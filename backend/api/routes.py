from fastapi import APIRouter
from utils.geminiHandler import processImage

router = APIRouter()


@router.get("/")
async def root():
    return {"message": "Hello World"}


@router.get("/upload-image")
async def uploadImage():
    processImage()
    return {"message": "Hello World"}
