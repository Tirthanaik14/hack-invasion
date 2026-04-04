from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database.connection import get_db
from app.api.v1.deps import get_current_admin
from app.schemas.incident import IncidentStatusUpdate, IncidentResponse
from app.schemas.user import AdminLoginRequest, AdminTokenResponse
from app.schemas.common import MessageResponse
from app.services.incident_service import incident_service
from app.services.admin_service import admin_service
from app.core.auth import create_access_token, verify_admin_credentials
from app.core.constants import IncidentStatus
from app.core.exceptions import InvalidCredentialsError, IncidentNotFoundError
from app.config import settings

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.post("/login", response_model=AdminTokenResponse)
def admin_login(credentials: AdminLoginRequest):
    if not verify_admin_credentials(credentials.username, credentials.password):
        raise InvalidCredentialsError()
    token = create_access_token(
        data={"sub": credentials.username, "role": "admin"}
    )
    return AdminTokenResponse(
        access_token=token,
        token_type="bearer",
        username=credentials.username,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.patch("/incidents/{incident_id}/status", response_model=IncidentResponse)
async def update_incident_status(
    incident_id: int,
    payload: IncidentStatusUpdate,
    db: Session = Depends(get_db),
    _admin: dict = Depends(get_current_admin),
):
    incident = await incident_service.update_incident_status(
        db=db, incident_id=incident_id, new_status=payload.status
    )
    if not incident:
        raise IncidentNotFoundError(incident_id)
    return incident


@router.post("/incidents/{incident_id}/acknowledge", response_model=IncidentResponse)
async def acknowledge_incident(
    incident_id: int,
    db: Session = Depends(get_db),
    _admin: dict = Depends(get_current_admin),
):
    incident = await incident_service.update_incident_status(
        db=db, incident_id=incident_id, new_status=IncidentStatus.ACKNOWLEDGED
    )
    if not incident:
        raise IncidentNotFoundError(incident_id)
    return incident


@router.post("/incidents/{incident_id}/resolve", response_model=IncidentResponse)
async def resolve_incident(
    incident_id: int,
    db: Session = Depends(get_db),
    _admin: dict = Depends(get_current_admin),
):
    incident = await incident_service.update_incident_status(
        db=db, incident_id=incident_id, new_status=IncidentStatus.RESOLVED
    )
    if not incident:
        raise IncidentNotFoundError(incident_id)
    return incident


@router.post("/chaos", response_model=List[IncidentResponse])
async def trigger_chaos_mode(
    db: Session = Depends(get_db),
    _admin: dict = Depends(get_current_admin),
):
    incidents = await admin_service.trigger_chaos_mode(db=db)
    return incidents


@router.post("/run-expiry-check", response_model=MessageResponse)
def run_expiry_check(
    db: Session = Depends(get_db),
    _admin: dict = Depends(get_current_admin),
):
    count = incident_service.run_expiry_check(db=db)
    return MessageResponse(message=f"Expiry check complete. {count} incidents marked as Unverified.")
