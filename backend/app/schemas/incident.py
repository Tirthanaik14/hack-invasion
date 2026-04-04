from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime
from app.core.constants import IncidentType, SeverityLevel, IncidentStatus


class IncidentCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    incident_type: IncidentType
    severity: SeverityLevel
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    location_name: Optional[str] = Field(None, max_length=255)
    reporter_name: Optional[str] = Field("Anonymous", max_length=100)

    @field_validator("latitude")
    @classmethod
    def validate_latitude(cls, v: float) -> float:
        if not (-90 <= v <= 90):
            raise ValueError("Latitude must be between -90 and 90")
        return v

    @field_validator("longitude")
    @classmethod
    def validate_longitude(cls, v: float) -> float:
        if not (-180 <= v <= 180):
            raise ValueError("Longitude must be between -180 and 180")
        return v


class IncidentStatusUpdate(BaseModel):
    status: IncidentStatus
    admin_note: Optional[str] = Field(None, max_length=500)


class IncidentResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    incident_type: str
    severity: str
    status: str
    latitude: float
    longitude: float
    location_name: Optional[str]
    reporter_name: Optional[str]
    reporter_count: int
    is_high_activity: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime
    acknowledged_at: Optional[datetime]
    resolved_at: Optional[datetime]

    model_config = {"from_attributes": True}


class IncidentListResponse(BaseModel):
    incidents: List[IncidentResponse]
    total: int
    active_count: int
    critical_count: int


class IncidentFilter(BaseModel):
    type: Optional[str] = None
    severity: Optional[str] = None
    status: Optional[str] = None
    limit: int = Field(default=100, ge=1, le=500)
    offset: int = Field(default=0, ge=0)
