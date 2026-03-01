from pydantic import BaseModel

class RSVPCreate(BaseModel):
    guest_name: str
    mobile: str
    adults: int
    kids: int
    food_preference: str
    note: str | None = None