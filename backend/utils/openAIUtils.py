ASSISTANT_ID=
def postUserMessage(threadID, content):
    res = await requests.post("https://api.openai.com/v1/threads/$threadID/messages", headers={"Content-Type": "application/json",
        "Authorization": "Bearer ${dotenv.env["OPENAI_API_KEY"]}",
        "OpenAI-Beta": "assistants=v2"},
json = {"role": "user", "content": content}
)
def runThread():
    res = await requests.post(
        "https://api.openai.com/v1/threads/$threadID/runs",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {dotenv.env['OPENAI_API_KEY']}",
            "OpenAI-Beta": "assistants=v2",
        },
        json={"assistant_id": assistantID},
    )
