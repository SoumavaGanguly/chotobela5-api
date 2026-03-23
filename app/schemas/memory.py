from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MemoryBase(BaseModel):
    guest_name: str
    message: str
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    audio_url: Optional[str] = None
    type: str

class MemoryCreate(MemoryBase):
    pass

class MemoryResponse(MemoryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True