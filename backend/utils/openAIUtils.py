from dotenv import load_dotenv
import os
import requests

load_dotenv()
API_KEY = os.getenv("OPENAI_API_KEY")
url = "https://api.openai.com/v1/threads"


def createThread():
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}",
        "OpenAI-Beta": "assistants=v2",
    }
    try:
        response = requests.post(url, headers=headers)

        if response.status_code == 200:  # valid
            thread_data = response.json()
            return thread_data["id"]

        else:
            raise Exception(
                f"Failed to create thread: {response.status_code} - {response.text}"
            )

    except Exception as e:
        raise Exception(f"Failed to load thread: {e}")


ASSISTANT_ID = "asst_PSc5JDxh4ngTXHnJJHNYTHam"


def postMessage(threadID, content):
    res = requests.post(
        f"https://api.openai.com/v1/threads/{threadID}/messages",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {API_KEY}",
            "OpenAI-Beta": "assistants=v2",
        },
        json={"role": "user", "content": content},
    )

    return threadID, res.content.decode()


def runThread(threadID):
    res = requests.post(
        f"https://api.openai.com/v1/threads/{threadID}/runs",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {API_KEY}",
            "OpenAI-Beta": "assistants=v2",
        },
        json={"assistant_id": ASSISTANT_ID},
    )
    return res
