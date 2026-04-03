from fastapi import APIRouter
from app.api.v1.routes import incidents, admin, events

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(incidents.router)
api_router.include_router(admin.router)
api_router.include_router(events.router)
