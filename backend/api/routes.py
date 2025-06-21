from models.message import Message
from fastapi import APIRouter
from utils.geminiHandler import processImage
from utils.openAIUtils import createThread, postMessage

router = APIRouter()


@router.get("/")
async def root():
    return {"message": "Hello World"}


@router.post("/upload-image")
async def uploadImage():
    processImage()
    return {"message": "Hello World"}


@router.post("/send-message-gpt")
async def sendMessage(message: Message):
    if message.threadID == "":
        tid = createThread()
    else:
        tid = message.threadID
    tid, res = postMessage(tid, message.content)
    return {"threadID": tid, "message": res}
