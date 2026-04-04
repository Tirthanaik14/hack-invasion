"""
Seed script — populates the database with 15 realistic Mumbai incidents.
Run from the backend/ directory:
    python seed.py
"""
import sys
import os
from datetime import datetime, timedelta
import random

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database.connection import SessionLocal, engine
from app.database.base import Base
from app.models.incident import Incident  # noqa: ensure model registered
from app.models.user import AdminUser     # noqa: ensure model registered
from app.core.constants import IncidentType, SeverityLevel, IncidentStatus

Base.metadata.create_all(bind=engine)

SEED_INCIDENTS = [
    {
        "title": "Severe Waterlogging at Dharavi Main Road",
        "description": "Knee-deep water flooding the main arterial road. Multiple vehicles stranded. Residents unable to exit homes.",
        "incident_type": IncidentType.FLOOD.value,
        "severity": SeverityLevel.CRITICAL.value,
        "status": IncidentStatus.ACTIVE.value,
        "latitude": 19.0416,
        "longitude": 72.8556,
        "location_name": "Dharavi",
        "reporter_name": "Ramesh Patil",
        "reporter_count": 7,
        "is_high_activity": True,
        "is_verified": False,
    },
    {
        "title": "Fire in Bandra Slum Area",
        "description": "Structure fire spreading rapidly through densely packed tin-roof structures. Fire brigade called.",
        "incident_type": IncidentType.FIRE.value,
        "severity": SeverityLevel.CRITICAL.value,
        "status": IncidentStatus.ACKNOWLEDGED.value,
        "latitude": 19.0596,
        "longitude": 72.8295,
        "location_name": "Bandra",
        "reporter_name": "Priya Menon",
        "reporter_count": 4,
        "is_high_activity": True,
        "is_verified": True,
        "acknowledged_at": datetime.utcnow() - timedelta(hours=1),
    },
    {
        "title": "Heatwave Alert — Kurla East",
        "description": "Temperature touching 44°C. Multiple elderly residents reported dehydrated. No water supply since morning.",
        "incident_type": IncidentType.HEATWAVE.value,
        "severity": SeverityLevel.WARNING.value,
        "status": IncidentStatus.ACTIVE.value,
        "latitude": 19.0728,
        "longitude": 72.8826,
        "location_name": "Kurla",
        "reporter_name": "Suresh Kumar",
        "reporter_count": 3,
        "is_high_activity": True,
        "is_verified": False,
    },
    {
        "title": "Flyover Structural Crack — Andheri West",
        "description": "Visible longitudinal crack on Andheri flyover deck. Debris falling on vehicles below. Police cordoning area.",
        "incident_type": IncidentType.INFRASTRUCTURE_COLLAPSE.value,
        "severity": SeverityLevel.CRITICAL.value,
        "status": IncidentStatus.ACKNOWLEDGED.value,
        "latitude": 19.1136,
        "longitude": 72.8697,
        "location_name": "Andheri",
        "reporter_name": "Amit Shah",
        "reporter_count": 9,
        "is_high_activity": True,
        "is_verified": True,
        "acknowledged_at": datetime.utcnow() - timedelta(hours=2),
    },
    {
        "title": "Road Waterlogging — Sion Circle",
        "description": "Sion hospital road completely blocked due to monsoon overflow from Mithi river.",
        "incident_type": IncidentType.WATERLOGGING.value,
        "severity": SeverityLevel.WARNING.value,
        "status": IncidentStatus.ACTIVE.value,
        "latitude": 19.0422,
        "longitude": 72.8618,
        "location_name": "Sion",
        "reporter_name": "Kavita Nair",
        "reporter_count": 2,
        "is_high_activity": False,
        "is_verified": False,
    },
    {
        "title": "Gas Leak — Dadar Residential Building",
        "description": "Strong smell of gas from 3rd floor. Residents evacuated. BMC gas department contacted.",
        "incident_type": IncidentType.GAS_LEAK.value,
        "severity": SeverityLevel.CRITICAL.value,
        "status": IncidentStatus.RESOLVED.value,
        "latitude": 19.0178,
        "longitude": 72.8478,
        "location_name": "Dadar",
        "reporter_name": "Vijay Borse",
        "reporter_count": 5,
        "is_high_activity": False,
        "is_verified": True,
        "acknowledged_at": datetime.utcnow() - timedelta(hours=5),
        "resolved_at": datetime.utcnow() - timedelta(hours=2),
    },
    {
        "title": "Lower Parel Mill Area Flooding",
        "description": "Phoenix Mills compound flooded. Basement parking submerged. Several cars stuck.",
        "incident_type": IncidentType.FLOOD.value,
        "severity": SeverityLevel.WARNING.value,
        "status": IncidentStatus.ACTIVE.value,
        "latitude": 18.9949,
        "longitude": 72.8280,
        "location_name": "Lower Parel",
        "reporter_name": "Neha Joshi",
        "reporter_count": 6,
        "is_high_activity": True,
        "is_verified": False,
    },
    {
        "title": "Building Wall Collapse — Ghatkopar",
        "description": "Compound wall of 4-storey building collapsed in heavy rain. No injuries reported. Debris blocking road.",
        "incident_type": IncidentType.BUILDING_COLLAPSE.value,
        "severity": SeverityLevel.CRITICAL.value,
        "status": IncidentStatus.ACKNOWLEDGED.value,
        "latitude": 19.0860,
        "longitude": 72.9081,
        "location_name": "Ghatkopar",
        "reporter_name": "Dinesh Sawant",
        "reporter_count": 3,
        "is_high_activity": False,
        "is_verified": True,
        "acknowledged_at": datetime.utcnow() - timedelta(minutes=45),
    },
    {
        "title": "Electrical Transformer Fire — Malad",
        "description": "Overhead transformer caught fire after short circuit. Power outage in 3 sectors. Fire brigade on site.",
        "incident_type": IncidentType.FIRE.value,
        "severity": SeverityLevel.WARNING.value,
        "status": IncidentStatus.ACTIVE.value,
        "latitude": 19.1868,
        "longitude": 72.8484,
        "location_name": "Malad",
        "reporter_name": "Shweta Iyer",
        "reporter_count": 4,
        "is_high_activity": False,
        "is_verified": False,
    },
    {
        "title": "Heatwave — Borivali National Park Area",
        "description": "Forest area heat stress. Temperature 47°C. Wildlife sightings near residential boundary. Tourist warning issued.",
        "incident_type": IncidentType.HEATWAVE.value,
        "severity": SeverityLevel.LOW.value,
        "status": IncidentStatus.ACTIVE.value,
        "latitude": 19.2290,
        "longitude": 72.8567,
        "location_name": "Borivali",
        "reporter_name": "Forest Department",
        "reporter_count": 1,
        "is_high_activity": False,
        "is_verified": False,
    },
    {
        "title": "Thane Creek Bridge Crack Spotted",
        "description": "Minor crack on Thane Creek Bridge support pillar. Structural engineers summoned. Traffic slowed to one lane.",
        "incident_type": IncidentType.INFRASTRUCTURE_COLLAPSE.value,
        "severity": SeverityLevel.WARNING.value,
        "status": IncidentStatus.ACKNOWLEDGED.value,
        "latitude": 19.2183,
        "longitude": 72.9781,
        "location_name": "Thane",
        "reporter_name": "Traffic Control Room",
        "reporter_count": 2,
        "is_high_activity": False,
        "is_verified": True,
        "acknowledged_at": datetime.utcnow() - timedelta(hours=3),
    },
    {
        "title": "Mulund Check Naka Waterlogging",
        "description": "Mulund check naka submerged due to heavy overnight rain. LBT trucks stranded. BMC pumps deployed.",
        "incident_type": IncidentType.WATERLOGGING.value,
        "severity": SeverityLevel.LOW.value,
        "status": IncidentStatus.RESOLVED.value,
        "latitude": 19.1726,
        "longitude": 72.9563,
        "location_name": "Mulund",
        "reporter_name": "Pramod Deshmukh",
        "reporter_count": 2,
        "is_high_activity": False,
        "is_verified": True,
        "acknowledged_at": datetime.utcnow() - timedelta(hours=8),
        "resolved_at": datetime.utcnow() - timedelta(hours=4),
    },
    {
        "title": "Fire at Dharavi Leather Market",
        "description": "Fire broke out in leather goods godown. Thick black smoke visible from 2km. 2 fire engines dispatched.",
        "incident_type": IncidentType.FIRE.value,
        "severity": SeverityLevel.CRITICAL.value,
        "status": IncidentStatus.HIGH_ACTIVITY.value,
        "latitude": 19.0440,
        "longitude": 72.8540,
        "location_name": "Dharavi",
        "reporter_name": "Ravi Kamble",
        "reporter_count": 8,
        "is_high_activity": True,
        "is_verified": False,
    },
    {
        "title": "Bandra-Worli Sea Link Fog Alert",
        "description": "Dense fog reducing visibility to under 50m on BWSL. Toll plaza deploying fog lights. Speed limit enforced.",
        "incident_type": IncidentType.INFRASTRUCTURE_COLLAPSE.value,
        "severity": SeverityLevel.LOW.value,
        "status": IncidentStatus.ACTIVE.value,
        "latitude": 19.0422,
        "longitude": 72.8188,
        "location_name": "Bandra-Worli",
        "reporter_name": "MTHL Authority",
        "reporter_count": 1,
        "is_high_activity": False,
        "is_verified": False,
    },
    {
        "title": "Andheri Station Stampede Risk",
        "description": "Extreme overcrowding at Andheri station FOB during peak hour. Risk of structural overload. RPF deployed.",
        "incident_type": IncidentType.INFRASTRUCTURE_COLLAPSE.value,
        "severity": SeverityLevel.WARNING.value,
        "status": IncidentStatus.ACKNOWLEDGED.value,
        "latitude": 19.1197,
        "longitude": 72.8466,
        "location_name": "Andheri",
        "reporter_name": "Railway Control",
        "reporter_count": 5,
        "is_high_activity": True,
        "is_verified": True,
        "acknowledged_at": datetime.utcnow() - timedelta(minutes=30),
    },
]


def seed():
    db = SessionLocal()
    try:
        existing = db.query(Incident).count()
        if existing > 0:
            print(f"[WARN] Database already has {existing} incidents. Skipping seed.")
            return

        now = datetime.utcnow()
        for i, data in enumerate(SEED_INCIDENTS):
            offset_hours = random.randint(0, 12)
            created = now - timedelta(hours=offset_hours)
            incident = Incident(
                title=data["title"],
                description=data["description"],
                incident_type=data["incident_type"],
                severity=data["severity"],
                status=data["status"],
                latitude=data["latitude"],
                longitude=data["longitude"],
                location_name=data["location_name"],
                reporter_name=data["reporter_name"],
                reporter_count=data["reporter_count"],
                is_high_activity=data["is_high_activity"],
                is_verified=data["is_verified"],
                created_at=created,
                updated_at=created,
                acknowledged_at=data.get("acknowledged_at"),
                resolved_at=data.get("resolved_at"),
            )
            db.add(incident)
            print(f"  [OK] [{i+1:02d}/15] {data['title']} - {data['location_name']}")

        db.commit()
        print(f"\nSeed complete -- {len(SEED_INCIDENTS)} incidents added to database.")
    except Exception as e:
        db.rollback()
        print(f"[ERROR] Seed failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    print("Seeding ResilienceNet database with Mumbai incidents...\n")
    seed()
