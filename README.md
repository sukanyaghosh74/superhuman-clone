# Superhuman Clone (Offline-first Gmail + AI)

A production-ready, offline-first Gmail client with AI-powered drafting, summarization, and follow-up suggestions. Designed for speed, hotkeys, and seamless offline usage.

## Features

* Full Gmail integration with offline-first support via Service Worker & IndexedDB
* AI-assisted email drafting, summarization, and follow-ups using OpenAI
* Predictive search and hotkey navigation inspired by Superhuman
* Secure token storage and OAuth authentication
* Local and Docker deployment options

## Quick Start (Local)

### Backend Setup

```bash
# Copy environment variables
cp .env.example .env
# Fill in your Google OAuth and OpenAI keys

# Python 3.11+
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
# Node 18+
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and login with Google.

### Docker Setup

```bash
docker compose up --build
```

## Environment Setup

* Configure OAuth consent in Google Cloud Console
* Add redirect URI: `http://localhost:8000/auth/callback`
* Required envs are documented in `.env.example`

## Tech Stack

* **Frontend:** React + Vite, Service Worker, IndexedDB
* **Backend:** FastAPI, SQLAlchemy, SQLite (dev) / Postgres (prod), google-api-python-client
* **AI:** OpenAI (drafting, summarization, follow-ups)

## Project Structure

```
backend/
  app/
    api/          # REST API endpoints
    services/     # Business logic and AI integrations
    models/       # SQLAlchemy models
    utils/        # Helper functions
    data/         # Local or cached data
frontend/
  src/            # React components, hooks, pages
  public/         # Static assets
```

## Key Code Snippets

### Backend: AI Drafting Service

```python
from openai import OpenAI

client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])

def generate_draft(prompt: str) -> str:
    response = client.chat.completions.create(
        model='gpt-4',
        messages=[{'role': 'user', 'content': prompt}],
        temperature=0.7
    )
    return response.choices[0].message.content
```

### Frontend: Offline Storage with IndexedDB

```javascript
import { openDB } from 'idb';

const dbPromise = openDB('emails-db', 1, {
  upgrade(db) {
    db.createObjectStore('emails', { keyPath: 'id' });
  }
});

export async function saveEmail(email) {
  const db = await dbPromise;
  await db.put('emails', email);
}
```

## Security Notes

* Tokens are encrypted at rest using `TOKEN_ENCRYPTION_KEY`
* Always use HTTPS in production
* Set proper CORS origins in FastAPI

## Customization

* Extend AI capabilities (summaries, follow-ups, drafts) in `backend/app/services/ai_service.py`
* Add custom hotkeys and offline sync behavior in frontend service worker
* Swap SQLite for Postgres or other databases in production

## License

MIT
