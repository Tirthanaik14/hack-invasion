import random
from datetime import datetime
from typing import List
from sqlalchemy.orm import Session

from app.models.incident import Incident
from app.core.constants import (
    IncidentType,
    SeverityLevel,
    IncidentStatus,
    MUMBAI_LOCATIONS,
)
from app.services.sse_service import sse_service
from app.services.incident_service import incident_service


CHAOS_TEMPLATES = [
    {"title": "Severe Flooding Reported", "description": "Multiple streets submerged, vehicles stranded."},
    {"title": "Structure Fire Detected", "description": "Flames visible from multiple floors, evacuation underway."},
    {"title": "Heatwave Emergency Alert", "description": "Temperatures exceeding 45°C, mass dehydration cases."},
    {"title": "Flyover Crack Detected", "description": "Structural cracks in main overpass, debris falling."},
    {"title": "Gas Pipeline Rupture", "description": "Strong gas smell, residents evacuating nearby buildings."},
    {"title": "Waterlogging — Road Closed", "description": "Knee-deep water on arterial road, traffic halted."},
    {"title": "Building Collapse Warning", "description": "Old structure showing signs of imminent collapse."},
    {"title": "Electrical Short Circuit Fire", "description": "Transformer fire spreading to nearby structures."},
]


class AdminService:
    async def trigger_chaos_mode(self, db: Session) -> List[Incident]:
        """Create 5 random incidents across Mumbai for demo purposes."""
        created = []
        for _ in range(5):
            template = random.choice(CHAOS_TEMPLATES)
            location = random.choice(MUMBAI_LOCATIONS)
            incident_type = random.choice(list(IncidentType))
            severity = random.choice(list(SeverityLevel))

            # Add small random offset to coordinates for variety
            lat_jitter = random.uniform(-0.005, 0.005)
            lng_jitter = random.uniform(-0.005, 0.005)

            now = datetime.utcnow()
            incident = Incident(
                title=template["title"],
                description=template["description"],
                incident_type=incident_type.value,
                severity=severity.value,
                status=IncidentStatus.ACTIVE,
                latitude=round(location["lat"] + lat_jitter, 6),
                longitude=round(location["lng"] + lng_jitter, 6),
                location_name=location["name"],
                reporter_name="Chaos Mode",
                reporter_count=1,
                is_high_activity=False,
                is_verified=False,
                created_at=now,
                updated_at=now,
            )
            db.add(incident)
            db.flush()
            created.append(incident)

        db.commit()
        for inc in created:
            db.refresh(inc)
            await sse_service.broadcast("incident_created", incident_service._serialize(inc))

        return created


admin_service = AdminService()
