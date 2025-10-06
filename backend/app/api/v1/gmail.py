from fastapi import APIRouter, Depends, HTTPException, Request
from app.services.gmail import GmailService, credentials_from_request
from app.models.schemas import SendEmailRequest

router = APIRouter()

async def get_service(request: Request) -> GmailService:
    creds = credentials_from_request(request)
    if not creds:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return GmailService(creds)

@router.get("/messages")
async def list_messages(q: str | None = None, label_ids: str | None = None, service: GmailService = Depends(get_service)):
    return await service.list_messages(q=q, label_ids=label_ids.split(",") if label_ids else None)

@router.get("/threads/{thread_id}")
async def get_thread(thread_id: str, service: GmailService = Depends(get_service)):
    return await service.get_thread(thread_id)

@router.post("/send")
async def send_email(payload: SendEmailRequest, service: GmailService = Depends(get_service)):
    return await service.send_email(payload)

@router.delete("/messages/{message_id}")
async def delete_message(message_id: str, service: GmailService = Depends(get_service)):
    return await service.delete_message(message_id)
