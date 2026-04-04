# 🌊 ResilienceNet — Real-Time Deep-Tech Disaster Intelligence

> **Hackathon Winning Project** | Community-Driven AI-Powered Disaster Response for Mumbai

[![FastAPI](https://img.shields.io/badge/FastAPI-Production_Ready-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react)](https://react.dev)
[![AI Assessment](https://img.shields.io/badge/AI-Auto--Assessment-FF6B6B?style=flat)](https://github.com/Tirthanaik14)

---

## 🚨 The Emergency

Mumbai faces extreme climate vulnerabilities — flash floods, fires, and infrastructure collapses. Conventional emergency response relies on scattered phone calls causing a **data fragmentation nightmare**. By the time first responders analyze the sheer volume of duplicate reports, the **Golden Hour** has passed.

## 💡 The Innovation: ResilienceNet

ResilienceNet is a **Full-Stack, Real-Time Geo-Spatial Emergency Grid**. We bypassed traditional polling strategies and built an aggressive, bi-directional intelligence platform.

### 🔥 Why it stands out (The "Wow" Factor)
1. **AI Auto-Assessment Engine**: User descriptions are parsed through an NLP-simulate heuristic layer that intercepts under-reported emergencies (e.g. "blood", "explosion") and forcefully escalates them to `CRITICAL` before database insertion.
2. **Real-Time Sentinel UI**: Built with Framer Motion and React-Leaflet, the map consumes a `Server-Sent Events (SSE)` stream to dynamically render new threats in *milliseconds* without a single page reload.
3. **Geo-Deduplication Algorithm**: A custom Haversine backend service automatically merges incident reports of the same crisis within a 500-meter radius, tracking "high velocity" threats without spamming the database.
4. **Radar "Area of Effect" Mapping**: Critical threats don't just get a marker—they deploy an 800m massive visual red-zone directly on the live map, keeping the UI instantly readable for commanders.
5. **Secure Admin Command Center**: JWT-authenticated operations dashboard allowing crisis managers to verify, isolate, and resolve incidents with one click.

---

## ✨ System Architecture

```text
frontend/ (Vite + React 19 + Tailwind)
 ├── pages/Report.jsx        # Geo-locating intelligence submission
 ├── pages/Home.jsx          # Live Map Engine (Leaflet + SSE Integration)
 ├── pages/AdminDashboard.jsx# Command Center (JWT Secured)

backend/ (FastAPI + SQLAlchemy)
 ├── services/incident_service.py # AI heuristics & CRUD
 ├── services/geo_service.py      # Spatial deduplication 
 ├── services/sse_service.py      # Real-time event broadcasting
```

## 🛠️ Tech Stack Architecture
**Core Logic**: Python (FastAPI), **Database**: SQLite (Production: PostgreSQL)
**Client Edge**: React 19, Vite, Tailwind CSS, Framer Motion
**Geo-Spatial**: React-Leaflet, Leaflet.js
**Data Pipeline**: Server-Sent Events (SSE), RESTful APIs with Pydantic Validation

---

## 🚀 Setup Instructions

### 1. Backend Server
```bash
cd backend
python -m venv venv
source venv/bin/activate  # UNIX
# venv\Scripts\activate   # WINDOWS
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend Subsystem
```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Operator Access
To review the Admin UI capabilities:
- **Route**: `http://localhost:5173/admin/login`
- **User**: `admin`
- **Pass**: `admin123`

---
*Developed relentlessly for Hack Invasion.*
