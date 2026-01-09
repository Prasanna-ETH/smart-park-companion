from fastapi import APIRouter, Depends, HTTPException, WebSocket
from sqlalchemy.orm import Session
from .. import database, schemas, crud, auth, models, camera
from typing import List

router = APIRouter(prefix="/owner", tags=["Owner"])

@router.post("/parks", response_model=schemas.ParkResponse)
def create_park(
    park: schemas.ParkCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_owner)
):
    created_park = crud.create_park(db=db, park=park, user_id=current_user.id)
    if park.camera_rtsp_url:
        camera.start_analysis(created_park.id, park.camera_rtsp_url)
    return created_park

@router.get("/parks", response_model=List[schemas.ParkResponse])
def get_my_parks(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_owner)
):
    return db.query(models.Park).filter(models.Park.owner_id == current_user.id).all()

@router.get("/dashboard/{park_id}")
def get_dashboard(
    park_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_owner)
):
    park = crud.get_park(db, park_id)
    if not park:
        raise HTTPException(status_code=404, detail="Park not found")
    if park.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    total_slots = park.total_slots
    occupied_slots = db.query(models.Slot).filter(models.Slot.park_id == park_id, models.Slot.is_occupied == True).count()
    revenue = db.query(models.Booking).filter(models.Booking.slot.has(park_id=park_id)).with_entities(models.Booking.amount).all()
    total_revenue = sum([r[0] for r in revenue if r[0]])

    slots = db.query(models.Slot).filter(models.Slot.park_id == park_id).all()
    slots_data = [{"id": s.id, "slot_number": s.slot_number, "is_occupied": s.is_occupied} for s in slots]

    return {
        "park_name": park.name,
        "total_slots": total_slots,
        "occupied_slots": occupied_slots,
        "available_slots": total_slots - occupied_slots,
        "total_revenue": total_revenue,
        "slots": slots_data
    }

@router.get("/analytics/{park_id}")
def get_analytics(
    park_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_owner)
):
    # Security check
    park = db.query(models.Park).filter(models.Park.id == park_id, models.Park.owner_id == current_user.id).first()
    if not park:
        raise HTTPException(status_code=404, detail="Park not found")
    
    # Mock some trend data for the chart
    # In real app, we would query bookings grouped by day
    trend_data = [
        {"name": "Mon", "revenue": 1200, "occupancy": 65},
        {"name": "Tue", "revenue": 1900, "occupancy": 80},
        {"name": "Wed", "revenue": 1500, "occupancy": 70},
        {"name": "Thu", "revenue": 2200, "occupancy": 85},
        {"name": "Fri", "revenue": 3000, "occupancy": 95},
        {"name": "Sat", "revenue": 2800, "occupancy": 90},
        {"name": "Sun", "revenue": 1800, "occupancy": 75},
    ]
    
    return {
        "trend": trend_data,
        "top_slots": [
            {"slot": "A1", "count": 145},
            {"slot": "A5", "count": 132},
            {"slot": "B2", "count": 128},
        ]
    }

@router.get("/logs/{park_id}", response_model=List[schemas.LogResponse])
def get_logs(
    park_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_owner)
):
    # Security check
    park = db.query(models.Park).filter(models.Park.id == park_id, models.Park.owner_id == current_user.id).first()
    if not park:
        raise HTTPException(status_code=404, detail="Park not found")
    
    logs = db.query(models.Log).filter(models.Log.park_id == park_id).order_by(models.Log.timestamp.desc()).limit(50).all()
    
    results = []
    for log in logs:
        results.append({
            "id": log.id,
            "park_id": log.park_id,
            "slot_id": log.slot_id,
            "event_type": log.event_type,
            "description": log.description,
            "timestamp": log.timestamp,
            "slot_number": log.slot.slot_number if log.slot else "N/A"
        })
    return results

# WebSockets would be handled in main or a dedicated ws router usually, but can be here.
@router.patch("/parks/{park_id}", response_model=schemas.ParkResponse)
def update_park(
    park_id: int,
    park_update: schemas.ParkUpdate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_owner)
):
    db_park = db.query(models.Park).filter(models.Park.id == park_id, models.Park.owner_id == current_user.id).first()
    if not db_park:
        raise HTTPException(status_code=404, detail="Park not found")
    
    update_data = park_update.dict(exclude_unset=True)
    
    for key, value in update_data.items():
        if key == "camera_rtsp_url":
            db_park.camera_rtsp_url_encrypted = value
            camera.start_analysis(db_park.id, value)
        else:
            setattr(db_park, key, value)
    
    db.commit()
    db.refresh(db_park)
    return db_park
