import cv2
import threading
import time
from . import crud, database, models
from sqlalchemy.orm import Session
try:
    from ultralytics import YOLO
except ImportError:
    YOLO = None
    print("Ultralytics not installed, camera analysis will be mocked.")

# Global dictionary to stop threads
active_cameras = {}

class CameraAnalyzer:
    def __init__(self, park_id: int, rtsp_url: str):
        self.park_id = park_id
        self.rtsp_url = rtsp_url
        self.running = False
        try:
            self.model = YOLO('yolov8n.pt') if YOLO else None # Load model once
        except Exception as e:
            print(f"Failed to load YOLO model: {e}")
            self.model = None

    def start(self):
        self.running = True
        thread = threading.Thread(target=self._process_stream)
        thread.start()

    def stop(self):
        self.running = False

    def _process_stream(self):
        # cap = cv2.VideoCapture(self.rtsp_url) 
        # For demo, we might fail to open RTSP so we Mock or handle gracefully
        
        db_gen = database.get_db()
        db = next(db_gen)

        print(f"Starting analysis for Park {self.park_id}")
        
        while self.running:
            # ret, frame = cap.read()
            # if not ret:
            #     # Handle reconnection
            #     time.sleep(5)
            #     continue

            # Run YOLO inference
            # results = self.model(frame)
            
            # Logic to Map bounding boxes to predefined Slots (ROIs)
            # This is complex and requires setup (defining coordinates for each slot)
            
            # MOCK LOGIC for demo:
            # Randomly flip slot status to simulate real-time updates
            import random
            slots = db.query(models.Slot).filter(models.Slot.park_id == self.park_id).all()
            if slots:
                slot = random.choice(slots)
                # Toggle status
                new_status = not slot.is_occupied
                crud.update_slot_status(db, slot.id, new_status)
                
                # Log event if it became occupied
                if new_status:
                    log = models.Log(
                        park_id=self.park_id,
                        event_type="entry",
                        description=f"Vehicle detected in slot {slot.slot_number}"
                    )
                    db.add(log)
                    db.commit()

            time.sleep(10) # Poll every 10s

        # cap.release()
        print(f"Stopped analysis for Park {self.park_id}")

def start_analysis(park_id: int, rtsp_url: str):
    if park_id in active_cameras:
        return # Already running
    
    analyzer = CameraAnalyzer(park_id, rtsp_url)
    active_cameras[park_id] = analyzer
    analyzer.start()

def stop_analysis(park_id: int):
    if park_id in active_cameras:
        active_cameras[park_id].stop()
        del active_cameras[park_id]
