from fastapi import APIRouter, Depends
from fastapi import Query
from app.services.auth import admin_auth
from sqlalchemy.orm import Session
from app.database.deps import get_db
from app.database.db import Base, engine
from app.models.rsvp import RSVP
from app.schemas.rsvp import RSVPCreate
from app.services.analytics import get_summary

Base.metadata.create_all(bind=engine)

router = APIRouter()

@router.post("/")
def create_rsvp(payload: RSVPCreate, db: Session = Depends(get_db)):
    rsvp = RSVP(**payload.dict())
    db.add(rsvp)
    db.commit()
    db.refresh(rsvp)
    return {"status": "success", "id": rsvp.id}

@router.get("/")
def get_all_rsvps(db: Session = Depends(get_db)):
    return db.query(RSVP).all()

@router.get("/summary")
def rsvp_summary(
    password: str = Query(...),
    db: Session = Depends(get_db)
):
    admin_auth(password)
    return get_summary(db)