from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from app.database.base import Base
from app.core.constants import IncidentType, SeverityLevel, IncidentStatus


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    description = Column(String(1000), nullable=True)
    incident_type = Column(String(50), nullable=False, default=IncidentType.FLOOD)
    severity = Column(String(20), nullable=False, default=SeverityLevel.LOW)
    status = Column(String(30), nullable=False, default=IncidentStatus.ACTIVE)

    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    location_name = Column(String(255), nullable=True)

    reporter_name = Column(String(100), nullable=True, default="Anonymous")
    reporter_count = Column(Integer, nullable=False, default=1)

    is_high_activity = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    acknowledged_at = Column(DateTime, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
