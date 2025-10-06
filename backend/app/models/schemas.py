from pydantic import BaseModel, EmailStr
from typing import List, Optional

class SendEmailRequest(BaseModel):
    to: EmailStr
    subject: str
    body: str
    cc: Optional[List[EmailStr]] = None

class AIDraftRequest(BaseModel):
    thread_snippet: str
    tone: Optional[str] = "professional"

class AISummaryRequest(BaseModel):
    thread_text: str
    max_bullets: int = 5
