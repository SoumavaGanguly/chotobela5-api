from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.database.db import Base

class RSVP(Base):
    __tablename__ = "rsvps"

    id = Column(Integer, primary_key=True, index=True)
    guest_name = Column(String, nullable=False)
    mobile = Column(String, nullable=False)
    adults = Column(Integer, default=1)
    kids = Column(Integer, default=0)
    food_preference = Column(String, nullable=False)
    note = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)