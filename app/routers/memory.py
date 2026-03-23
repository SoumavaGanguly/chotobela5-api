from fastapi import APIRouter, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session
from typing import Optional, List
import shutil
import uuid
import os
import cloudinary
import cloudinary.uploader
from app.core.logger import get_logger
from app.database.deps import get_db

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME", "do8rnam8e"),
    api_key=os.getenv("CLOUDINARY_API_KEY", "297362597741494"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET", "Qfd09na7RxrF9PwutyxWV187aEw")
)
from app.models.memory import Memory as MemoryModel
from app.schemas.memory import MemoryResponse

logger = get_logger(__name__)

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/", response_model=MemoryResponse)
def upload_memory(
    guest_name: str = Form(...),
    message: str = Form(...),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    image_url = None
    if image:
        result = cloudinary.uploader.upload(image.file, resource_type="image")
        image_url = result.get("secure_url")

    db_memory = MemoryModel(
        guest_name=guest_name,
        message=message,
        image_url=image_url,
        video_url=None,
        audio_url=None,
        type="photo"
    )
    db.add(db_memory)
    db.commit()
    db.refresh(db_memory)

    logger.info(f"Photo memory uploaded by {guest_name}")
    return db_memory


@router.post("/video", response_model=MemoryResponse)
def upload_video_memory(
    guest_name: str = Form(...),
    message: str = Form(...),
    video: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    result = cloudinary.uploader.upload_large(video.file, resource_type="video")
    video_url = result.get("secure_url")

    db_memory = MemoryModel(
        guest_name=guest_name,
        message=message,
        image_url=None,
        video_url=video_url,
        audio_url=None,
        type="video"
    )
    db.add(db_memory)
    db.commit()
    db.refresh(db_memory)

    logger.info(f"Video memory uploaded by {guest_name}")
    return db_memory


@router.post("/audio", response_model=MemoryResponse)
def upload_audio_memory(
    guest_name: str = Form(...),
    message: str = Form(...),
    audio: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    result = cloudinary.uploader.upload_large(audio.file, resource_type="video")
    audio_url = result.get("secure_url")

    db_memory = MemoryModel(
        guest_name=guest_name,
        message=message,
        image_url=None,
        video_url=None,
        audio_url=audio_url,
        type="audio"
    )
    db.add(db_memory)
    db.commit()
    db.refresh(db_memory)

    logger.info(f"Audio memory uploaded by {guest_name}")
    return db_memory


@router.get("/", response_model=List[MemoryResponse])
def get_memories(db: Session = Depends(get_db)):
    memories = db.query(MemoryModel).order_by(MemoryModel.created_at.desc()).all()
    return memories
