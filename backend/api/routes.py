from models.message import Message
from fastapi import APIRouter
from utils.geminiHandler import processImage
from utils.openAIUtils import createThread, postMessage, runThread
import base64
from fastapi import APIRouter, File, HTTPException, UploadFile
import Message

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
    # res3 = getMessage(tid)
    return {"threadID": tid, "message2": res2}


@router.post("/analyze-image/")
async def analyze_image(message: Message, image: UploadFile = File(...)):
    image_bytes = await image.read()
    image_b64 = base64.b64encode(image_bytes).decode("utf-8")
    result = await processImage(image_b64)
    
    message.content = result
    gemini_result = await sendMessage(message)
    return {"analysis": result, "gemini_result": gemini_result}
