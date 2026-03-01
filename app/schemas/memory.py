from pydantic import BaseModel

class MemoryCreate(BaseModel):
    guest_name: str
    message: str
    image_url: str | None = None