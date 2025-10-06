## Superhuman Clone (Offline-first Gmail + AI)

### Quick Start (Local)
1. Copy envs: `cp .env.example .env` and fill values (Google OAuth, OpenAI).
2. Backend:
   - Python 3.11+
   - `cd backend && pip install -r requirements.txt`
   - `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
3. Frontend:
   - Node 18+
   - `cd frontend && npm i && npm run dev`
4. Open `http://localhost:5173`. Click Login to start Google OAuth.

### Docker
- `docker compose up --build`

### Google OAuth Setup
- Create OAuth Client ID (Web) in Google Cloud Console.
- Authorized redirect URI: `http://localhost:8000/auth/callback`
- Add your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to `.env`.

### Environment
- See `.env.example` for required variables. Update `BACKEND_CORS_ORIGINS` appropriately.

### Features
- Gmail integration: list messages, view thread, send, delete, archive, labels
- Offline-first: Service Worker caching + IndexedDB for messages/threads
- Hotkeys: j/k navigate, e archive, del delete, c compose, r reply (in thread)
- AI: Draft, Summarize, Follow-ups via OpenAI

### Build for Production
- Frontend: `cd frontend && npm run build`
- Backend: `cd backend && pip install -r requirements.txt && uvicorn app.main:app --host 0.0.0.0 --port 8000`
- Or run `docker compose up --build`

### Security Notes
- Tokens encrypted at rest with `TOKEN_ENCRYPTION_KEY` and stored as httpOnly cookie example. In production, store per-user tokens in a DB tied to an authenticated session.
- Use HTTPS and set secure cookies.

### Limitations / Next Steps
- Add DB-backed sessions and multi-account support
- Enhance predictive search (contacts, subjects) and local FTS
- Dark mode styling

### License
MIT
