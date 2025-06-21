from fastapi import APIRouter
from utils.geminiHandler import processImage
from utils.openAIUtils.py import postMessage

router = APIRouter()


@router.get("/")
async def root():
    return {"message": "Hello World"}


@router.get("/upload-image")
async def uploadImage():
    processImage()
    return {"message": "Hello World"}

@router.get("/send-message-gpt")
async def sendMessage():
    postMessage()
    return {"message": "Hello World"}