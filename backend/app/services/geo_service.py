from typing import Optional
from sqlalchemy.orm import Session
from app.models.incident import Incident
from app.core.constants import IncidentStatus
from app.utils.geo import is_within_radius
from app.config import settings


class GeoService:
    def find_nearby_duplicate(
        self,
        db: Session,
        latitude: float,
        longitude: float,
        incident_type: str,
        radius_meters: Optional[float] = None,
    ) -> Optional[Incident]:
        """
        Find an existing active incident of the same type within the duplicate radius.
        Returns the first matching incident or None.
        """
        radius = radius_meters or settings.DUPLICATE_RADIUS_METERS
        active_statuses = [
            IncidentStatus.ACTIVE,
            IncidentStatus.ACKNOWLEDGED,
            IncidentStatus.HIGH_ACTIVITY,
        ]
        candidates = (
            db.query(Incident)
            .filter(
                Incident.incident_type == incident_type,
                Incident.status.in_(active_statuses),
            )
            .all()
        )
        for incident in candidates:
            if is_within_radius(
                latitude, longitude, incident.latitude, incident.longitude, radius
            ):
                return incident
        return None


geo_service = GeoService()
