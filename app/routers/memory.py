from fastapi import APIRouter, UploadFile, File, Form
import shutil
import uuid

router = APIRouter()

@router.post("/")
def upload_memory(
    guest_name: str = Form(...),
    message: str = Form(...),
    image: UploadFile = File(...)
):
    filename = f"{uuid.uuid4()}_{image.filename}"
    path = f"uploads/{filename}"

    with open(path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    return {
        "status": "success",
        "guest_name": guest_name,
        "message": message,
        "image_url": path
    }