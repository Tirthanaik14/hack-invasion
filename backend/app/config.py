from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional


class Settings(BaseSettings):
    APP_NAME: str = "ResilienceNet"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    DATABASE_URL: str = "sqlite:///./resiliencenet.db"

    SECRET_KEY: str = "resiliencenet-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "admin123"

    DUPLICATE_RADIUS_METERS: float = 500.0
    HIGH_ACTIVITY_THRESHOLD: int = 3
    HIGH_ACTIVITY_WINDOW_MINUTES: int = 30
    AUTO_EXPIRY_HOURS: int = 24

    CORS_ORIGINS: list = ["*"]

    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
