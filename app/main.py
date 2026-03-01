import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.routers import rsvp, memory

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

app.include_router(rsvp.router, prefix="/api/rsvp", tags=["RSVP"])
app.include_router(memory.router, prefix="/api/memory", tags=["Memory Wall"])

@app.get("/")
def root():
    return {"status": "Chotobela 5 API running 🎈"}