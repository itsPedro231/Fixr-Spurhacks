from pydantic import BaseModel


class Message(BaseModel):
    threadID: str | None = None
    content: str
