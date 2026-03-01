from fastapi import APIRouter, UploadFile, File, Form
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
    image: UploadFile = File(...)
):
    filename = f"{uuid.uuid4()}_{image.filename}"
    path = f"{UPLOAD_DIR}/{filename}"

    with open(path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    memory = {
        "guest_name": guest_name,
        "message": message,
        "image_url": path
    }

    memories.append(memory)
    logger.info(f"Memory uploaded by {guest_name}")
    logger.info(f"Memories till now:\n {memories}")
    return {"status": "success"}

@router.get("/")
def get_memories():
    return memories