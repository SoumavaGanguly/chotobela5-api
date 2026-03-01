from sqlalchemy.orm import Session
from app.models.rsvp import RSVP
from sqlalchemy import func

def get_summary(db: Session):
    total = db.query(RSVP).count()
    veg = db.query(RSVP).filter(RSVP.food_preference == "Veg").count()
    nonveg = db.query(RSVP).filter(RSVP.food_preference == "NonVeg").count()

    adults = db.query(func.sum(RSVP.adults)).scalar() or 0
    kids = db.query(func.sum(RSVP.kids)).scalar() or 0

    return {
        "total_rsvps": total,
        "veg": veg,
        "nonveg": nonveg,
        "adults": adults,
        "kids": kids,
        "plates_required": adults + kids
    }