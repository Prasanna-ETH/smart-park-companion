from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, owner, user
import uvicorn
import asyncio
from typing import List

# Create Tables (Managed via Supabase SQL Editor for RLS/Triggers)
# Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Park Companion API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(owner.router)
app.include_router(user.router)

@app.get("/")
def read_root():
    return {"message": "Smart Park Companion API is running"}

# WebSocket Connection Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws/logs/{park_id}")
async def websocket_endpoint(websocket: WebSocket, park_id: int):
    await manager.connect(websocket)
    try:
        while True:
            # Simple mock of pushing data every few seconds
            # In a real app, this would be triggered by DB events or Redis Pub/Sub
            await websocket.receive_text() # Keep alive
            # await manager.broadcast(f"Update for park {park_id}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
