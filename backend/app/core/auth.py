from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from app.config import settings
from app.core.exceptions import UnauthorizedError


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise UnauthorizedError("Token payload invalid")
        return payload
    except JWTError:
        raise UnauthorizedError("Token is invalid or expired")


def verify_admin_credentials(username: str, password: str) -> bool:
    return (
        username == settings.ADMIN_USERNAME and password == settings.ADMIN_PASSWORD
    )
