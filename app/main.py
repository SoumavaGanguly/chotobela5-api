import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.routers import rsvp, memory
from app.core.logger import get_logger
from app.database.db import engine, Base
from app.models import memory as memory_model
# Also import rsvp model if it exists to ensure it is created, wait, let's keep it safe.


logger = get_logger("app.startup")

load_dotenv()

app = FastAPI(
    title="Chotobela 5 API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # will restrict later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(rsvp.router, prefix="/api/rsvp", tags=["RSVP"])
app.include_router(memory.router, prefix="/api/memory", tags=["Memory Wall"])

@app.get("/")
def root():
    return {"status": "Chotobela 5 API running 🎈"}

@app.on_event("startup")
def startup_event():
    # Make sure tables are created
    Base.metadata.create_all(bind=engine)
    logger.info("Chotobela 5 API started successfully")