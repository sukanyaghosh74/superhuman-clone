from fastapi import APIRouter
from app.services.ai import ai_draft, ai_summarize, ai_followups
from app.models.schemas import AIDraftRequest, AISummaryRequest

router = APIRouter()

@router.post("/draft")
async def draft_email(req: AIDraftRequest):
    return await ai_draft(req)

@router.post("/summarize")
async def summarize(req: AISummaryRequest):
    return await ai_summarize(req)

@router.post("/followups")
async def followups(req: AISummaryRequest):
    return await ai_followups(req)
