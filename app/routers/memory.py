from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional
import shutil
import uuid
import os
from app.core.logger import get_logger

logger = get_logger(__name__)

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

memories = []  # simple in-memory list (OK for birthday use)

@router.post("/")
def upload_memory(
    guest_name: str = Form(...),
    message: str = Form(...),
    image: Optional[UploadFile] = File(None)
):
    image_url = None
    if image:
        filename = f"{uuid.uuid4()}_{image.filename}"
        path = f"{UPLOAD_DIR}/{filename}"
        with open(path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        image_url = path

    memory = {
        "guest_name": guest_name,
        "message": message,
        "image_url": image_url,
        "video_url": None,
        "audio_url": None,
        "type": "photo"
    }

    memories.append(memory)
    logger.info(f"Photo memory uploaded by {guest_name}")
    return {"status": "success"}


@router.post("/video")
def upload_video_memory(
    guest_name: str = Form(...),
    message: str = Form(...),
    video: UploadFile = File(...)
):
    filename = f"{uuid.uuid4()}_{video.filename}"
    path = f"{UPLOAD_DIR}/{filename}"
    with open(path, "wb") as buffer:
        shutil.copyfileobj(video.file, buffer)

    memory = {
        "guest_name": guest_name,
        "message": message,
        "image_url": None,
        "video_url": path,
        "audio_url": None,
        "type": "video"
    }

    memories.append(memory)
    logger.info(f"Video memory uploaded by {guest_name}")
    return {"status": "success"}


@router.post("/audio")
def upload_audio_memory(
    guest_name: str = Form(...),
    message: str = Form(...),
    audio: UploadFile = File(...)
):
    filename = f"{uuid.uuid4()}_{audio.filename}"
    path = f"{UPLOAD_DIR}/{filename}"
    with open(path, "wb") as buffer:
        shutil.copyfileobj(audio.file, buffer)

    memory = {
        "guest_name": guest_name,
        "message": message,
        "image_url": None,
        "video_url": None,
        "audio_url": path,
        "type": "audio"
    }

    memories.append(memory)
    logger.info(f"Audio memory uploaded by {guest_name}")
    return {"status": "success"}


@router.get("/")
def get_memories():
    return memories
