from enum import Enum


class IncidentType(str, Enum):
    FLOOD = "Flood"
    FIRE = "Fire"
    HEATWAVE = "Heatwave"
    INFRASTRUCTURE_COLLAPSE = "Infrastructure Collapse"
    LANDSLIDE = "Landslide"
    GAS_LEAK = "Gas Leak"
    BUILDING_COLLAPSE = "Building Collapse"
    WATERLOGGING = "Waterlogging"


class SeverityLevel(str, Enum):
    LOW = "Low"
    WARNING = "Warning"
    CRITICAL = "Critical"


class IncidentStatus(str, Enum):
    ACTIVE = "Active"
    ACKNOWLEDGED = "Acknowledged"
    RESOLVED = "Resolved"
    UNVERIFIED = "Unverified"
    HIGH_ACTIVITY = "High Activity"


MUMBAI_LOCATIONS = [
    {"name": "Dharavi", "lat": 19.0416, "lng": 72.8556},
    {"name": "Bandra", "lat": 19.0596, "lng": 72.8295},
    {"name": "Kurla", "lat": 19.0728, "lng": 72.8826},
    {"name": "Andheri", "lat": 19.1136, "lng": 72.8697},
    {"name": "Sion", "lat": 19.0422, "lng": 72.8618},
    {"name": "Dadar", "lat": 19.0178, "lng": 72.8478},
    {"name": "Lower Parel", "lat": 18.9949, "lng": 72.8280},
    {"name": "Ghatkopar", "lat": 19.0860, "lng": 72.9081},
    {"name": "Borivali", "lat": 19.2290, "lng": 72.8567},
    {"name": "Malad", "lat": 19.1868, "lng": 72.8484},
    {"name": "Thane", "lat": 19.2183, "lng": 72.9781},
    {"name": "Mulund", "lat": 19.1726, "lng": 72.9563},
]
