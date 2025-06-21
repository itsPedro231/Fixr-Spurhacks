import base64
from fastapi import APIRouter, File, HTTPException, UploadFile
from utils.geminiHandler import processImage


router = APIRouter()


@router.get("/")
async def root():
    return {"message": "Hello World"}


@router.get("/upload-image")
async def uploadImage():
    processImage()
    return {"message": "Hello World"}

@router.post("/analyze-image/")
async def analyze_image(image: UploadFile = File(...)):
    image_bytes = await image.read()
    image_b64 = base64.b64encode(image_bytes).decode('utf-8')
    result = await processImage(image_b64)
    return {"analysis": result}
