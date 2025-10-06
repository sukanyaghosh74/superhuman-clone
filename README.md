## Superhuman Clone (Offline-first Gmail + AI)

### Quick Start (Local)
1. Copy envs: `cp .env.example .env` and fill values (Google OAuth, OpenAI).
2. Install backend deps and run:
   - Python 3.11+
   - `cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
3. Install frontend and run:
   - Node 18+
   - `cd frontend && npm i && npm run dev`
4. Open `http://localhost:5173`. Login with Google.

### Docker
- `docker compose up --build`

### Environment
- Configure OAuth consent and add redirect `http://localhost:8000/auth/callback` in Google Cloud Console.
- Required envs are documented in `.env.example`.

### Tech Stack
- Frontend: React + Vite, Service Worker, IndexedDB
- Backend: FastAPI, SQLAlchemy, SQLite (dev) / Postgres (prod), google-api-python-client
- AI: OpenAI for drafting, summarization, follow-ups

### Project Structure
```
backend/
  app/
    api/
    services/
    models/
    utils/
    data/
frontend/
  src/
  public/
```

### Security Notes
- Tokens stored encrypted at rest with `TOKEN_ENCRYPTION_KEY`.
- Use HTTPS in production and set proper CORS origins.

### License
MIT
