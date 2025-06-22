from models.message import Message
from fastapi import APIRouter, Form
from utils.geminiHandler import processImage
from utils.openAIUtils import createThread, postMessage, runThread
import base64
import json
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
    # res3 = getMessage(tid)
    return {"threadID": tid, "message2": res2}


@router.post("/analyze-image/")
async def analyze_image(
    image: UploadFile = File(...)
):
    # Create a Message instance from form fields
    message = Message(threadID="", content="")

    # Read and encode image
    image_bytes = await image.read()
    image_b64 = base64.b64encode(image_bytes).decode("utf-8")

    # Call your image processing and Gemini logic
    result = await processImage(image_b64)

    gemini_result = await sendMessage(
        Message(threadID=message.threadID, content=str(result))
    )

    return {
        "analysis": result,
        "gemini_result": gemini_result
    }


@router.post("/test-openai-gemini/")
async def test_openai_gemini(image: UploadFile = File(...)):
    image_bytes = await image.read()
    image_b64 = base64.b64encode(image_bytes).decode("utf-8")
    gemini_result = await processImage(image_b64)

    openai_thread_id = createThread()
    _, openai_response = postMessage(openai_thread_id, str(gemini_result))
    final_response = runThread(openai_thread_id)

    return {
        "openai_response": final_response,
    }
