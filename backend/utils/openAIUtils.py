import time
from dotenv import load_dotenv
import requests
import os
import certifi

from pymongo import MongoClient

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
db = client["user_info"]
collection = db["workers"]


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
    content += getData()
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

    if not res.ok:
        print(f"Error starting run: {res.status_code} - {res.text}")
        return None

    run_data = res.json()
    run_id = run_data.get("id")

    if not run_id:
        print(f"Error: 'id' not found in run creation response: {run_data}")
        return None


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
        return getMessages(threadID)
    else:
        print(f"Run finished with status: {status}")
        return None, threadID


def getMessages(threadID):
    res = requests.get(
        f"https://api.openai.com/v1/threads/{threadID}/messages", headers=HEADERS
    )

    if res.status_code == 200:
        messages_data = res.json()
        messages = messages_data.get("data", [])
        if not messages:
            return None, threadID

        # Find the most recent message from the assistant
        for message in sorted(messages, key=lambda x: x.get('created_at', 0), reverse=True):
            if message.get('role') == 'assistant':
                content = message.get('content', [])
                if content and content[0].get('type') == 'text':
                    return content[0]['text'].get('value'), threadID

        return None, threadID  # No assistant message found

    else:
        print(f"Failed to get messages: {res.status_code} - {res.text}")
        return None, threadID


def getData():
    results = collection.find() #think of this as a list you can loop through containing all the records inside the collection of workers
    output = ""
    for doc in results:
        name = doc.get("name", "Unknown")
        worker_type = doc.get("type", "N/A")
        location = doc.get("location", "N/A")
        phone = doc.get("phone", "N/A")
        rating = doc.get("rating", "N/A")
        services = ", ".join(doc.get("services", []))
        availability = doc.get("availability", True)

        availability_str = "Available" if availability else "Not Available"
        
        output += (
            f"Name: {name}\n"
            f"Type: {worker_type}\n"
            f"Location: {location}\n"
            f"Phone: {phone}\n"
            f"Rating: {rating}\n"
            f"Services: {services}\n"
            f"Availability: {availability_str}\n"
            "------------------------\n"
        )

    return output
 
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

