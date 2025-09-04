from pydantic import BaseModel

class SummarizeTextRequest(BaseModel):
    text: str
