from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from .. import database, schemas, crud, auth, models
from typing import List

router = APIRouter(prefix="/user", tags=["User"])

@router.get("/parks/nearby", response_model=List[schemas.ParkResponse])
def get_nearby_parks(
    lat: float,
    lon: float,
    radius: float = 5.0,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    parks = crud.get_nearby_parks(db, lat, lon, radius)
    # Enrich with availability
    for park in parks:
        occupied = db.query(models.Slot).filter(models.Slot.park_id == park.id, models.Slot.is_occupied == True).count()
        park.available_slots = park.total_slots - occupied
    return parks

@router.get("/parks/{park_id}", response_model=schemas.ParkResponse)
def get_park_detail(
    park_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    park = db.query(models.Park).filter(models.Park.id == park_id).first()
    if not park:
        raise HTTPException(status_code=404, detail="Park not found")
    
    # Enrich with availability and slots
    occupied = db.query(models.Slot).filter(models.Slot.park_id == park.id, models.Slot.is_occupied == True).count()
    park.available_slots = park.total_slots - occupied
    
    # We also need slots for the grid
    slots = db.query(models.Slot).filter(models.Slot.park_id == park_id).all()
    park.slots = slots 
    
    return park

@router.post("/bookings", response_model=schemas.BookingResponse)
def create_booking(
    booking: schemas.BookingCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_booking = crud.create_booking(db, booking, current_user.id)
    if not db_booking:
        raise HTTPException(status_code=400, detail="No slots available")
    return db_booking

@router.get("/bookings")
def get_my_bookings(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    bookings = db.query(models.Booking).filter(models.Booking.user_id == current_user.id).all()
    results = []
    for b in bookings:
        results.append({
            "id": b.id,
            "park_name": b.slot.park.name,
            "address": b.slot.park.location,
            "slot_number": b.slot.slot_number,
            "start_time": b.start_time,
            "status": b.status,
            "amount": b.amount
        })
    return results
