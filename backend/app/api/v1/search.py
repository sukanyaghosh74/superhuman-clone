from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import AsyncSessionLocal
from app.models.email import CachedMessage, Contact

router = APIRouter()

async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session

@router.get('/suggest')
async def suggest(q: str, limit: int = 5, db: AsyncSession = Depends(get_db)):
    if not q:
        return {"emails": [], "contacts": []}
    q_like = f"%{q}%"
    msgs = await db.execute(select(CachedMessage).where(CachedMessage.snippet.like(q_like)).limit(limit))
    contacts = await db.execute(select(Contact).where(Contact.email.like(q_like)).order_by(Contact.score.desc()).limit(limit))
    return {
        "emails": [m.id for m in msgs.scalars().all()],
        "contacts": [c.email for c in contacts.scalars().all()],
    }
