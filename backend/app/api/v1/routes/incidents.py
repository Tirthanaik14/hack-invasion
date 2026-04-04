from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.database.connection import get_db
from app.schemas.incident import IncidentCreate, IncidentResponse, IncidentListResponse
from app.services.incident_service import incident_service
from app.core.exceptions import IncidentNotFoundError

router = APIRouter(prefix="/incidents", tags=["Incidents"])


@router.post("", response_model=IncidentResponse, status_code=201)
async def create_incident(
    payload: IncidentCreate,
    db: Session = Depends(get_db),
):
    incident = await incident_service.create_incident(db=db, payload=payload)
    return incident


@router.get("", response_model=IncidentListResponse)
def list_incidents(
    type: Optional[str] = Query(None, description="Filter by incident type"),
    severity: Optional[str] = Query(None, description="Filter by severity"),
    status: Optional[str] = Query(None, description="Filter by status"),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    result = incident_service.get_incidents(
        db=db,
        incident_type=type,
        severity=severity,
        status=status,
        limit=limit,
        offset=offset,
    )
    return result


@router.get("/{incident_id}", response_model=IncidentResponse)
def get_incident(
    incident_id: int,
    db: Session = Depends(get_db),
):
    incident = incident_service.get_incident_by_id(db=db, incident_id=incident_id)
    if not incident:
        raise IncidentNotFoundError(incident_id)
    return incident
