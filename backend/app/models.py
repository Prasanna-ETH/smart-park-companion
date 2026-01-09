from .database import Base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float, JSON
from sqlalchemy.orm import relationship
from datetime import datetime

class User(Base):
    __tablename__ = "profiles"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    role = Column(String) # "owner" or "user"
    full_name = Column(String)

    parks = relationship("Park", back_populates="owner")
    bookings = relationship("Booking", back_populates="user")

class Park(Base):
    __tablename__ = "parks"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    owner_id = Column(String, ForeignKey("profiles.id"))
    location = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    total_slots = Column(Integer)
    hourly_rate = Column(Float)
    camera_rtsp_url_encrypted = Column(String) # Store encrypted
    payment_link = Column(String)
    
    owner = relationship("User", back_populates="parks")
    slots = relationship("Slot", back_populates="park")

class Slot(Base):
    __tablename__ = "slots"

    id = Column(Integer, primary_key=True, index=True)
    park_id = Column(Integer, ForeignKey("parks.id"))
    slot_number = Column(String)
    is_occupied = Column(Boolean, default=False)
    last_updated = Column(DateTime, default=datetime.utcnow)

    park = relationship("Park", back_populates="slots")
    current_booking = relationship("Booking", back_populates="slot", uselist=False)

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("profiles.id"))
    slot_id = Column(Integer, ForeignKey("slots.id"))
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime)
    status = Column(String, default="active") # active, completed, cancelled
    amount = Column(Float)
    payment_id = Column(String, nullable=True)

    user = relationship("User", back_populates="bookings")
    slot = relationship("Slot", back_populates="current_booking")

class Log(Base):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, index=True)
    park_id = Column(Integer, ForeignKey("parks.id"))
    slot_id = Column(Integer, ForeignKey("slots.id"), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    event_type = Column(String) # entry, exit, alert
    description = Column(String)
    snapshot_url = Column(String, nullable=True)

    park = relationship("Park")
    slot = relationship("Slot")
