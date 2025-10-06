from fastapi import APIRouter
from app.api.v1 import auth, gmail, ai, search

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(gmail.router, prefix="/gmail", tags=["gmail"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
api_router.include_router(search.router, prefix="/search", tags=["search"])
