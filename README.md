# 🌊 ResilienceNet — Real-Time Hyper-Local Disaster Reporting System

> **Hackathon Project** | Community-Driven Disaster Response for Mumbai

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat&logo=python)](https://python.org)
[![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=flat&logo=sqlite)](https://sqlite.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🚨 Problem Statement

Mumbai faces recurring natural and man-made disasters — floods, fires, building collapses, gas leaks — yet there is **no real-time, community-driven system** that:
- Allows citizens to report incidents instantly with geo-location
- Clusters duplicate reports into a single verified alert
- Provides live status updates to all stakeholders simultaneously
- Enables admin teams to triage, verify, and resolve incidents with a single action

Emergency services often receive **fragmented, delayed, and unverified** reports via social media or phone calls. Precious minutes are lost.

---

## 💡 Solution: ResilienceNet

ResilienceNet is a **FastAPI-powered backend** that enables:
- 📍 **Geo-tagged incident reporting** with automatic duplicate detection (within 500m)
- 🔴 **Real-time updates** via Server-Sent Events (SSE) — no polling needed
- 🔐 **Admin dashboard** with JWT-secured controls to verify, acknowledge, and resolve incidents
- 🤖 **Auto-expiry** — 24-hour unacknowledged incidents automatically flagged as unverified
- 🌪️ **Chaos Mode** — Simulate mass disaster events for demo/training
- 📊 **Incident analytics** — active count, critical count, heat map data

---

## ✨ Features

| Feature | Description |
|---|---|
| 🗺️ Geo-Deduplication | Reports within 500m of same type are merged (reporter count++) |
| 📡 Real-Time SSE | Instant push to all connected frontends on any incident change |
| 🔐 Admin JWT Auth | Secure login with role-based token verification |
| ⚡ High Activity Alert | Auto-escalates when 3+ reports appear in a 30-min window |
| 🕐 Auto Expiry | Marks unacknowledged incidents as Unverified after 24h |
| 🌪️ Chaos Mode | Creates 5 random incidents across Mumbai for demo/stress testing |
| 📋 OpenAPI Docs | Full Swagger UI at `/docs` and ReDoc at `/redoc` |

---

## 🏗️ Architecture

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── routes/
│   │       │   ├── incidents.py   # CRUD for incidents
│   │       │   ├── admin.py       # Admin-only controls
│   │       │   └── events.py      # SSE streaming endpoint
│   │       ├── deps.py            # Auth dependency injection
│   │       └── router.py          # Route aggregator
│   ├── core/
│   │   ├── auth.py                # JWT creation & verification
│   │   ├── constants.py           # Enums, Mumbai locations
│   │   └── exceptions.py          # Custom HTTP exceptions
│   ├── database/
│   │   ├── base.py                # SQLAlchemy declarative base
│   │   └── connection.py          # Engine & session factory
│   ├── models/
│   │   ├── incident.py            # Incident ORM model
│   │   └── user.py                # User ORM model
│   ├── schemas/
│   │   ├── incident.py            # Pydantic request/response schemas
│   │   ├── user.py                # Auth schemas
│   │   └── common.py              # Generic response schemas
│   ├── services/
│   │   ├── incident_service.py    # Business logic for incidents
│   │   ├── admin_service.py       # Chaos mode & admin operations
│   │   ├── geo_service.py         # Geo-radius duplicate detection
│   │   └── sse_service.py         # Real-time SSE broadcasting
│   ├── utils/
│   │   └── geo.py                 # Haversine distance calculation
│   ├── config.py                  # Pydantic settings (env-driven)
│   └── main.py                    # FastAPI app entrypoint
├── seed.py                        # Database seeder for demo data
├── requirements.txt               # Python dependencies
└── .env.example                   # Environment variable template
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | FastAPI 0.115 |
| **Database** | SQLite (dev) / PostgreSQL (production via SQLAlchemy) |
| **ORM** | SQLAlchemy 2.0 |
| **Validation** | Pydantic v2 |
| **Auth** | JWT (python-jose) + Passlib |
| **Real-Time** | Server-Sent Events (SSE) |
| **Configuration** | pydantic-settings (.env) |
| **Server** | Uvicorn |

---

## 🚀 Setup & Installation

### Prerequisites
- Python 3.11+
- pip

### 1. Clone the repository
```bash
git clone https://github.com/Tirthanaik14/hack-invasion.git
cd hack-invasion/backend
```

### 2. Create a virtual environment
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your values (especially SECRET_KEY in production!)
```

### 5. Run the development server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 6. (Optional) Seed demo data
```bash
python seed.py
```

---

## 📡 API Endpoints

### Public Endpoints
| Method | Path | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `GET` | `/health` | Service status |
| `GET` | `/api/v1/incidents` | List all incidents (with filters) |
| `POST` | `/api/v1/incidents` | Report a new incident |
| `GET` | `/api/v1/incidents/{id}` | Get incident by ID |
| `GET` | `/api/v1/events/stream` | SSE stream for real-time updates |

### Admin Endpoints (JWT Required)
| Method | Path | Description |
|---|---|---|
| `POST` | `/api/v1/admin/login` | Admin login (returns JWT) |
| `PATCH` | `/api/v1/admin/incidents/{id}/status` | Update incident status |
| `POST` | `/api/v1/admin/incidents/{id}/acknowledge` | Acknowledge incident |
| `POST` | `/api/v1/admin/incidents/{id}/resolve` | Resolve incident |
| `POST` | `/api/v1/admin/chaos` | Trigger chaos mode (5 random incidents) |
| `POST` | `/api/v1/admin/run-expiry-check` | Manually run 24h expiry check |

### Query Parameters for `GET /api/v1/incidents`
| Param | Type | Options |
|---|---|---|
| `type` | string | `Flood`, `Fire`, `Heatwave`, `Gas Leak`, etc. |
| `severity` | string | `Low`, `Warning`, `Critical` |
| `status` | string | `Active`, `Acknowledged`, `Resolved`, `High Activity` |
| `limit` | int | 1–500 (default: 100) |
| `offset` | int | 0+ (default: 0) |

---

## 📡 SSE Real-Time Events

Connect to `GET /api/v1/events/stream` for live updates:

```javascript
const source = new EventSource('http://localhost:8000/api/v1/events/stream');
source.onmessage = (event) => {
  const { event: eventType, data } = JSON.parse(event.data);
  // eventType: 'incident_created' | 'incident_updated' | 'connected'
  console.log(eventType, data);
};
```

---

## 🔐 Admin Usage

### 1. Login
```bash
curl -X POST http://localhost:8000/api/v1/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### 2. Use the token
```bash
curl -X POST http://localhost:8000/api/v1/admin/chaos \
  -H "Authorization: Bearer <your_token>"
```

---

## 🌐 Deployment

### Render (Recommended for Hackathon)
1. Push to GitHub
2. Create new **Web Service** on [Render](https://render.com)
3. Set **Build Command**: `pip install -r requirements.txt`
4. Set **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables from `.env.example`

### Vercel (Alternative for Serverless)
Not recommended for SSE — use Render or Railway instead.

---

## 🔮 Future Scope

- [ ] **AI Severity Scoring** — Gemini/GPT to auto-classify incident severity from description
- [ ] **Push Notifications** — FCM/Twilio SMS alerts for CRITICAL incidents
- [ ] **WebSocket Support** — Bi-directional communication for admin dashboards
- [ ] **Geo Clustering API** — Return clustered markers for map visualization
- [ ] **Incident Analytics Dashboard** — Heat maps, trend graphs, response time metrics
- [ ] **Multi-City Support** — Extend beyond Mumbai
- [ ] **Mobile App** — React Native / Flutter client
- [ ] **Webhook Integration** — Notify municipal corporation systems automatically

---

## 👥 Team

Built with ❤️ for Hack Invasion Hackathon

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
