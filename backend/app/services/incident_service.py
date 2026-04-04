from datetime import datetime, timedelta
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.models.incident import Incident
from app.schemas.incident import IncidentCreate
from app.core.constants import IncidentStatus, SeverityLevel
from app.config import settings
from app.services.geo_service import geo_service
from app.services.sse_service import sse_service


class IncidentService:

    async def create_incident(self, db: Session, payload: IncidentCreate) -> Incident:
        # Check for nearby duplicate
        duplicate = geo_service.find_nearby_duplicate(
            db=db,
            latitude=payload.latitude,
            longitude=payload.longitude,
            incident_type=payload.incident_type.value,
        )

        if duplicate:
            # Increase reporter count instead of creating new incident
            duplicate.reporter_count += 1
            duplicate.updated_at = datetime.utcnow()
            # Check high activity
            self._check_high_activity(db, duplicate)
            db.commit()
            db.refresh(duplicate)
            await sse_service.broadcast("incident_updated", self._serialize(duplicate))
            return duplicate

        # Create new incident
        now = datetime.utcnow()
        incident = Incident(
            title=payload.title,
            description=payload.description,
            incident_type=payload.incident_type.value,
            severity=payload.severity.value,
            status=IncidentStatus.ACTIVE,
            latitude=payload.latitude,
            longitude=payload.longitude,
            location_name=payload.location_name,
            reporter_name=payload.reporter_name or "Anonymous",
            reporter_count=1,
            is_high_activity=False,
            is_verified=False,
            created_at=now,
            updated_at=now,
        )
        db.add(incident)
        db.commit()
        db.refresh(incident)
        await sse_service.broadcast("incident_created", self._serialize(incident))
        return incident

    def get_incidents(
        self,
        db: Session,
        incident_type: Optional[str] = None,
        severity: Optional[str] = None,
        status: Optional[str] = None,
        limit: int = 100,
        offset: int = 0,
    ) -> dict:
        query = db.query(Incident)
        if incident_type:
            query = query.filter(Incident.incident_type == incident_type)
        if severity:
            query = query.filter(Incident.severity == severity)
        if status:
            query = query.filter(Incident.status == status)

        total = query.count()
        incidents = query.order_by(Incident.created_at.desc()).offset(offset).limit(limit).all()

        active_count = db.query(Incident).filter(
            Incident.status.in_([IncidentStatus.ACTIVE, IncidentStatus.HIGH_ACTIVITY])
        ).count()

        critical_count = db.query(Incident).filter(
            Incident.severity == SeverityLevel.CRITICAL,
            Incident.status != IncidentStatus.RESOLVED,
        ).count()

        return {
            "incidents": incidents,
            "total": total,
            "active_count": active_count,
            "critical_count": critical_count,
        }

    def get_incident_by_id(self, db: Session, incident_id: int) -> Optional[Incident]:
        return db.query(Incident).filter(Incident.id == incident_id).first()

    async def update_incident_status(
        self, db: Session, incident_id: int, new_status: IncidentStatus
    ) -> Optional[Incident]:
        incident = self.get_incident_by_id(db, incident_id)
        if not incident:
            return None

        incident.status = new_status
        incident.updated_at = datetime.utcnow()

        if new_status == IncidentStatus.ACKNOWLEDGED:
            incident.acknowledged_at = datetime.utcnow()
            incident.is_verified = True
        elif new_status == IncidentStatus.RESOLVED:
            incident.resolved_at = datetime.utcnow()

        db.commit()
        db.refresh(incident)
        await sse_service.broadcast("incident_updated", self._serialize(incident))
        return incident

    def run_expiry_check(self, db: Session) -> int:
        """Mark incidents older than 24h and not acknowledged as Unverified."""
        expiry_threshold = datetime.utcnow() - timedelta(hours=settings.AUTO_EXPIRY_HOURS)
        expired = (
            db.query(Incident)
            .filter(
                Incident.created_at < expiry_threshold,
                Incident.status == IncidentStatus.ACTIVE,
            )
            .all()
        )
        count = 0
        for incident in expired:
            incident.status = IncidentStatus.UNVERIFIED
            incident.updated_at = datetime.utcnow()
            count += 1
        if count > 0:
            db.commit()
        return count

    def _check_high_activity(self, db: Session, incident: Incident) -> None:
        """Mark as high activity if 3+ reports in 30-minute window."""
        window_start = datetime.utcnow() - timedelta(minutes=settings.HIGH_ACTIVITY_WINDOW_MINUTES)
        recent_count = (
            db.query(Incident)
            .filter(
                Incident.incident_type == incident.incident_type,
                Incident.latitude.between(incident.latitude - 0.01, incident.latitude + 0.01),
                Incident.longitude.between(incident.longitude - 0.01, incident.longitude + 0.01),
                Incident.created_at >= window_start,
            )
            .count()
        )
        if incident.reporter_count >= settings.HIGH_ACTIVITY_THRESHOLD or recent_count >= settings.HIGH_ACTIVITY_THRESHOLD:
            incident.is_high_activity = True
            if incident.status == IncidentStatus.ACTIVE:
                incident.status = IncidentStatus.HIGH_ACTIVITY

    def _serialize(self, incident: Incident) -> dict:
        return {
            "id": incident.id,
            "title": incident.title,
            "description": incident.description,
            "incident_type": incident.incident_type,
            "severity": incident.severity,
            "status": incident.status,
            "latitude": incident.latitude,
            "longitude": incident.longitude,
            "location_name": incident.location_name,
            "reporter_name": incident.reporter_name,
            "reporter_count": incident.reporter_count,
            "is_high_activity": incident.is_high_activity,
            "is_verified": incident.is_verified,
            "created_at": incident.created_at.isoformat(),
            "updated_at": incident.updated_at.isoformat(),
            "acknowledged_at": incident.acknowledged_at.isoformat() if incident.acknowledged_at else None,
            "resolved_at": incident.resolved_at.isoformat() if incident.resolved_at else None,
        }


incident_service = IncidentService()
