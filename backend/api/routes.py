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
    image: UploadFile = File(...),
    threadID: str = Form("")
):
    """
    Analyzes an uploaded image and sends the analysis to the chat.
    - Receives an image and an optional threadID.
    - If threadID is provided, uses the existing conversation.
    - If threadID is empty, creates a new conversation.
    """
    # Read and encode the image in base64
    image_bytes = await image.read()
    image_b64 = base64.b64encode(image_bytes).decode("utf-8")

    # Process the image with the Gemini handler to get the analysis
    analysis_result = await processImage(image_b64)

    # Send the analysis result as a message to the chat
    gemini_result = await sendMessage(
        Message(threadID=threadID, content=str(analysis_result))
    )

    return {
        "analysis": analysis_result,
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
