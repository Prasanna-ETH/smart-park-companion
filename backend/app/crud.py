from sqlalchemy.orm import Session
from . import models, schemas, auth
from datetime import datetime
from geopy.distance import geodesic

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password, role=user.role, full_name=user.full_name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_park(db: Session, park: schemas.ParkCreate, user_id: str):
    # Encrypt RTSP url here if needed (using Fernet)
    # For simplicity, we store it as is, but in prod use encryption
    db_park = models.Park(**park.dict(exclude={"id"}), owner_id=user_id)
    db.add(db_park)
    db.commit()
    db.refresh(db_park)
    
    # Create slots
    for i in range(1, park.total_slots + 1):
        slot = models.Slot(park_id=db_park.id, slot_number=f"A{i}")
        db.add(slot)
    db.commit()
    
    return db_park

def get_parks(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Park).offset(skip).limit(limit).all()

def get_park(db: Session, park_id: int):
    return db.query(models.Park).filter(models.Park.id == park_id).first()

def get_nearby_parks(db: Session, lat: float, lon: float, radius_km: float = 5.0):
    parks = db.query(models.Park).all()
    nearby = []
    user_loc = (lat, lon)
    for park in parks:
        park_loc = (park.latitude, park.longitude)
        if hasattr(park, 'latitude') and park.latitude:
             distance = geodesic(user_loc, park_loc).km
             if distance <= radius_km:
                 park.distance = distance
                 nearby.append(park)
    return nearby

def create_booking(db: Session, booking: schemas.BookingCreate, user_id: int):
    # Find available slot
    # Simple logic: first free slot
    slot = db.query(models.Slot).filter(models.Slot.park_id == booking.park_id, models.Slot.is_occupied == False).first()
    if not slot:
        return None
    
    park = get_park(db, booking.park_id)
    amount = park.hourly_rate * booking.duration_hours

    db_booking = models.Booking(
        user_id=user_id,
        slot_id=slot.id,
        end_time=datetime.utcnow(), # Needs proper calculation
        amount=amount,
        status="active"
    )
    db.add(db_booking)
    
    # Mark slot occupied
    slot.is_occupied = True
    db.commit()
    db.refresh(db_booking)
    return db_booking

def update_slot_status(db: Session, slot_id: int, is_occupied: bool):
    slot = db.query(models.Slot).filter(models.Slot.id == slot_id).first()
    if slot:
        slot.is_occupied = is_occupied
        slot.last_updated = datetime.utcnow()
        db.commit()
    return slot
