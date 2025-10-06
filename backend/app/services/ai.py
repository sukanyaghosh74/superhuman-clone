from openai import OpenAI
from app.utils.config import settings
from app.models.schemas import AIDraftRequest, AISummaryRequest

client = OpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None

async def ai_draft(req: AIDraftRequest):
    if not client:
        return {"draft": "[AI disabled]"}
    prompt = (
        f"Context: {req.thread_snippet}\n"
        f"Write a concise {req.tone} email reply with clear next steps."
    )
    resp = client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
    )
    return {"draft": resp.choices[0].message.content.strip()}

async def ai_summarize(req: AISummaryRequest):
    if not client:
        return {"summary": "[AI disabled]"}
    prompt = (
        "Summarize the following email thread into concise bullet points with action items.\n"
        f"Limit to {req.max_bullets} bullets.\n\n"
        f"Thread:\n{req.thread_text}"
    )
    resp = client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
    )
    return {"summary": resp.choices[0].message.content.strip()}

async def ai_followups(req: AISummaryRequest):
    if not client:
        return {"followups": ["[AI disabled]"]}
    prompt = (
        "From this email thread, list 3 concrete follow-up tasks with owners and due dates if implied.\n\n"
        f"Thread:\n{req.thread_text}"
    )
    resp = client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
    )
    return {"followups": [resp.choices[0].message.content.strip()]}
