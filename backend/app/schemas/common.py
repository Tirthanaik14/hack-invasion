from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TimestampMixin(BaseModel):
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class MessageResponse(BaseModel):
    message: str
    success: bool = True


class PaginationMeta(BaseModel):
    total: int
    page: int
    per_page: int
    pages: int
