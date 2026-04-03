from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.core.auth import verify_token
from app.core.exceptions import UnauthorizedError

security = HTTPBearer()


def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    token = credentials.credentials
    payload = verify_token(token)
    role = payload.get("role")
    if role != "admin":
        raise UnauthorizedError("Admin access required")
    return payload


def get_db_session() -> Session:
    return get_db()
