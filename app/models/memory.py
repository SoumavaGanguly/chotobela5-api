from sqlalchemy import Column, Integer, String, DateTime
import datetime
from app.database.db import Base

class Memory(Base):
    __tablename__ = "memories"

    id = Column(Integer, primary_key=True, index=True)
    guest_name = Column(String, index=True)
    message = Column(String)
    image_url = Column(String, nullable=True)
    video_url = Column(String, nullable=True)
    audio_url = Column(String, nullable=True)
    type = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
