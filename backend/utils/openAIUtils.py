from dotenv import load_env
import requests
import json
import os

load_dotenv()
API_KEY = os.getenv("API_KEY")
url = "https://api.openai.com/v1/threads"

def postMessage():
    pass

def createThread():
    
    headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {API_KEY}",
            "OpenAI-Beta": "assistants=v2"
        }
    try:
        response = requests.post(url, headers=headers)

        if response.status_code == 200: #valid
            thread_data = response.json()
            return thread_data
        
        else:
            raise Exception(f"Failed to create thread: {response.status_code} - {response.text}")

    except Exception as e:
        raise Exception(f"Failed to load thread: {e}")