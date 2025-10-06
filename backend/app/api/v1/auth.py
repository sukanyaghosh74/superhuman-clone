from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse
from app.services.gmail import get_google_oauth_flow, exchange_code_for_tokens
from app.utils.crypto import encrypt_token

router = APIRouter()

@router.get("/login")
async def login():
    flow = get_google_oauth_flow()
    auth_url, _ = flow.authorization_url(prompt="consent", access_type="offline", include_granted_scopes="true")
    return {"auth_url": auth_url}

@router.get("/callback")
async def callback(request: Request, code: str | None = None):
    if not code:
        raise HTTPException(status_code=400, detail="Missing code")
    creds = exchange_code_for_tokens(code)
    if not creds or not creds.refresh_token:
        raise HTTPException(status_code=400, detail="Failed to obtain tokens")
    # Store encrypted tokens in secure cookie (demo) or DB session
    encrypted_refresh = encrypt_token(creds.refresh_token)
    response = RedirectResponse(url="/")
    response.set_cookie(key="grt", value=encrypted_refresh, httponly=True, samesite="lax")
    return response
