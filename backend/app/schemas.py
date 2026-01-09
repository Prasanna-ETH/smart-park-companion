from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    role: str # "owner" or "user"
    full_name: str

class UserResponse(UserBase):
    id: str
    role: str
    full_name: str
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class SlotBase(BaseModel):
    slot_number: str
    is_occupied: bool

class SlotResponse(SlotBase):
    id: int
    park_id: int
    last_updated: datetime
    class Config:
        from_attributes = True

class ParkBase(BaseModel):
    name: str
    location: str
    total_slots: int
    hourly_rate: float
    payment_link: Optional[str] = None

class ParkCreate(ParkBase):
    id: int = None
    latitude: float
    longitude: float
    camera_rtsp_url: Optional[str] = None # Will be encrypted

class ParkUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    total_slots: Optional[int] = None
    hourly_rate: Optional[float] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    camera_rtsp_url: Optional[str] = None
    payment_link: Optional[str] = None

class ParkResponse(ParkBase):
    id: int
    owner_id: str
    latitude: float
    longitude: float
    available_slots: Optional[int] = 0
    distance: Optional[float] = None
    slots: Optional[List[SlotResponse]] = []
    class Config:
        from_attributes = True

class BookingCreate(BaseModel):
    park_id: int
    slot_id: Optional[int] = None
    duration_hours: int
    amount: Optional[float] = None

class BookingResponse(BaseModel):
    id: int
    park_name: Optional[str] = None
    address: Optional[str] = None
    slot_number: Optional[str] = None
    start_time: datetime
    end_time: Optional[datetime] = None
    status: str
    amount: float
    class Config:
        from_attributes = True

class LogResponse(BaseModel):
    id: int
    park_id: int
    slot_id: Optional[int] = None
    event_type: str
    description: str
    timestamp: datetime
    # We can also add slot_number here by using a property or resolving it in router
    slot_number: Optional[str] = None 
    class Config:
        from_attributes = True
