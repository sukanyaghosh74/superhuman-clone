from __future__ import annotations
from typing import Optional, List
import base64 as b64
import asyncio
from email.mime.text import MIMEText
from fastapi import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from app.utils.config import settings
from app.utils.crypto import decrypt_token
from app.models.schemas import SendEmailRequest

CLIENT_CONFIG = {
    "web": {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "redirect_uris": [str(settings.GOOGLE_REDIRECT_URI)],
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "javascript_origins": [settings.BACKEND_CORS_ORIGINS],
    }
}

SCOPES = settings.GOOGLE_SCOPES.split()

def get_google_oauth_flow() -> Flow:
    return Flow.from_client_config(CLIENT_CONFIG, scopes=SCOPES, redirect_uri=str(settings.GOOGLE_REDIRECT_URI))

def exchange_code_for_tokens(code: str) -> Credentials:
    flow = get_google_oauth_flow()
    flow.fetch_token(code=code)
    return flow.credentials

def credentials_from_request(request: Request) -> Optional[Credentials]:
    enc_refresh = request.cookies.get("grt")
    if not enc_refresh:
        return None
    try:
        refresh_token = decrypt_token(enc_refresh)
    except Exception:
        return None
    creds = Credentials(
        token=None,
        refresh_token=refresh_token,
        client_id=settings.GOOGLE_CLIENT_ID,
        client_secret=settings.GOOGLE_CLIENT_SECRET,
        token_uri="https://oauth2.googleapis.com/token",
        scopes=SCOPES,
    )
    return creds

class GmailService:
    def __init__(self, creds: Credentials):
        self.creds = creds
        self.service = build("gmail", "v1", credentials=self.creds, cache_discovery=False)

    async def list_messages(self, q: Optional[str] = None, label_ids: Optional[List[str]] = None):
        def _list():
            return self.service.users().messages().list(userId="me", q=q, labelIds=label_ids).execute()
        return await asyncio.to_thread(_list)

    async def get_thread(self, thread_id: str):
        def _get():
            return self.service.users().threads().get(userId="me", id=thread_id, format="full").execute()
        return await asyncio.to_thread(_get)

    async def send_email(self, payload: SendEmailRequest):
        message = MIMEText(payload.body)
        message["to"] = payload.to
        message["subject"] = payload.subject
        if payload.cc:
            message["cc"] = ", ".join(payload.cc)
        raw = b64.urlsafe_b64encode(message.as_bytes()).decode("utf-8")

        def _send():
            return self.service.users().messages().send(userId="me", body={"raw": raw}).execute()
        return await asyncio.to_thread(_send)

    async def delete_message(self, message_id: str):
        def _del():
            return self.service.users().messages().delete(userId="me", id=message_id).execute()
        await asyncio.to_thread(_del)
        return {"status": "deleted", "id": message_id}
