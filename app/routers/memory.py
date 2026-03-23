from fastapi import APIRouter, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session
from typing import Optional, List
import shutil
import uuid
import os
from app.core.logger import get_logger
from app.database.deps import get_db
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
        filename = f"{uuid.uuid4()}_{image.filename}"
        path = f"{UPLOAD_DIR}/{filename}"
        with open(path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        image_url = path

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
    filename = f"{uuid.uuid4()}_{video.filename}"
    path = f"{UPLOAD_DIR}/{filename}"
    with open(path, "wb") as buffer:
        shutil.copyfileobj(video.file, buffer)

    db_memory = MemoryModel(
        guest_name=guest_name,
        message=message,
        image_url=None,
        video_url=path,
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
    filename = f"{uuid.uuid4()}_{audio.filename}"
    path = f"{UPLOAD_DIR}/{filename}"
    with open(path, "wb") as buffer:
        shutil.copyfileobj(audio.file, buffer)

    db_memory = MemoryModel(
        guest_name=guest_name,
        message=message,
        image_url=None,
        video_url=None,
        audio_url=path,
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
