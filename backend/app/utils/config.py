from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl
import os

class Settings(BaseSettings):
    PORT: int = 8000
    BACKEND_CORS_ORIGINS: str = "http://localhost:5173"

    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URI: AnyHttpUrl
    GOOGLE_SCOPES: str

    OPENAI_API_KEY: str | None = None
    OPENAI_MODEL: str = "gpt-4o-mini"

    DATABASE_URL: str = "sqlite+aiosqlite:///./backend/app/data/app.db"

    APP_SECRET_KEY: str
    TOKEN_ENCRYPTION_KEY: str

    class Config:
        env_file = os.path.join(os.getcwd(), ".env")
        extra = "ignore"

settings = Settings()
