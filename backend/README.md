# ResilienceNet — Backend

Real-Time Hyper-Local Disaster Reporting & Response System for Mumbai.

## Stack

- **FastAPI** + Uvicorn (ASGI)
- **SQLAlchemy 2.x** ORM (SQLite default, PostgreSQL-ready)
- **Pydantic v2** schemas
- **JWT** authentication (python-jose)
- **SSE** (Server-Sent Events) for real-time push

---

## Quick Start

```bash
cd backend

# 1. Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/Mac

# 2. Install dependencies
pip install -r requirements.txt

# 3. Copy env config
copy .env.example .env

# 4. Start server
uvicorn app.main:app --reload

# 5. Seed database (optional but recommended)
python seed.py
```

Server runs at: http://127.0.0.1:8000
API Docs: http://127.0.0.1:8000/docs

---

## API Reference

### Public Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check |
| GET | `/health` | Health status |
| POST | `/api/v1/incidents` | Create incident |
| GET | `/api/v1/incidents` | List incidents (with filters) |
| GET | `/api/v1/incidents/{id}` | Get incident by ID |
| GET | `/api/v1/events/stream` | SSE real-time stream |

### Admin Endpoints (JWT Required)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/admin/login` | Get JWT token |
| PATCH | `/api/v1/admin/incidents/{id}/status` | Update status |
| POST | `/api/v1/admin/incidents/{id}/acknowledge` | Acknowledge |
| POST | `/api/v1/admin/incidents/{id}/resolve` | Resolve |
| POST | `/api/v1/admin/chaos` | Trigger chaos mode (5 incidents) |
| POST | `/api/v1/admin/run-expiry-check` | Mark old incidents Unverified |

---

## Query Filters

```
GET /api/v1/incidents?type=Flood&severity=Critical&status=Active&limit=50&offset=0
```

---

## Admin Login

```bash
curl -X POST http://localhost:8000/api/v1/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

## SSE Stream

```javascript
const es = new EventSource('http://localhost:8000/api/v1/events/stream');
es.onmessage = (e) => {
  const payload = JSON.parse(e.data);
  console.log(payload.event, payload.data);
};
```

---

## Incident Types

- `Flood`
- `Fire`
- `Heatwave`
- `Infrastructure Collapse`
- `Gas Leak`
- `Building Collapse`
- `Waterlogging`
- `Landslide`

## Severity Levels

- `Low` → `Warning` → `Critical`

## Status Flow

```
Active → High Activity
Active → Acknowledged → Resolved
Active → Unverified (auto after 24h)
```

---

## Database

- Default: **SQLite** (`resiliencenet.db`) — zero config
- Production: Set `DATABASE_URL=postgresql://...` in `.env`

---

## Chaos Mode (Demo)

POST to `/api/v1/admin/chaos` with admin JWT → instantly creates 5 randomized incidents across Mumbai locations. All broadcast via SSE.
