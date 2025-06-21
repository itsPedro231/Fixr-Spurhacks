from models.message import Message
from fastapi import APIRouter
from utils.geminiHandler import processImage
from utils.openAIUtils import createThread, postMessage, runThread
import base64
from fastapi import APIRouter, File, HTTPException, UploadFile

router = APIRouter()


@router.get("/")
async def root():
    return {"message": "Hello World"}


@router.post("/send-message-gpt")
async def sendMessage(message: Message):
    if message.threadID == "":
        tid = createThread()
    else:
        tid = message.threadID
    tid, res = postMessage(tid, message.content)
    res2 = runThread(tid)
    getMessage(tid)
    return {"threadID": tid, "message": res, "message2": res2}


@router.post("/analyze-image/")
async def analyze_image(image: UploadFile = File(...)):
    image_bytes = await image.read()
    image_b64 = base64.b64encode(image_bytes).decode("utf-8")
    result = await processImage(image_b64)
    return {"analysis": result}
