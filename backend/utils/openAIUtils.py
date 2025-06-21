import time
from dotenv import load_dotenv
import requests
import os

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


ASSISTANT_ID = "asst_5zx40an5r0WAoiHfQG2YVyCJ"


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


HEADERS = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {API_KEY}",
    "OpenAI-Beta": "assistants=v2",
}


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

    run_data = res.json()
    run_id = run_data["id"]

    # Step 2: Poll until run is complete
    while True:
        check_response = requests.get(
            f"https://api.openai.com/v1/threads/{threadID}/runs/{run_id}",
            headers=HEADERS,
        )

        if not check_response.ok:
            return None

        run_status = check_response.json()
        status = run_status["status"]

        if status in ("completed", "failed", "cancelled"):
            break

        time.sleep(1)  # Wait before polling again

    # Step 3: Get final messages if completed
    if status == "completed":
        messages_response = requests.get(
            f"https://api.openai.com/v1/threads/{threadID}/messages", headers=HEADERS
        )

        if not messages_response.ok:
            return None

        messages = messages_response.json()["data"]
        return messages[0]["content"][0]["text"][
            "value"
        ]  # Return last assistant message

    return None

def getData():
    return 
# def getMessage(threadID):
#    url = f"https://api.openai.com/v1/threads/{threadID}/messages"
#    headers = {
#        "Content-Type": "application/json",
#        "Authorization": f"Bearer {API_KEY}",
#        "OpenAI-Beta": "assistants=v2",
#    }
#    # params = {"limit": "2", "order": "desc"}
#    try:
#        response = requests.get(
#            url,
#            headers=headers,
#        )
#
#        print(response)
#        if response.status_code == 200:
#            data = response.json()
#            message = data["data"][0]["content"][0]["text"]["value"]
#            return message
#        else:
#            print(
#                f"Failed to get gpt message: {response.status_code} - {response.text}"
#            )
#            return None
#
#    except Exception as e:
#        print(f"Error while getting gpt message: {e}")
#        return None
#

