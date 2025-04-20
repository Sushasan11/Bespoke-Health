from fastapi import WebSocket
from typing import Dict, List
import logging

# Configure Logging
logging.basicConfig(level=logging.DEBUG)  # Change to DEBUG level


class WebSocketManager:
    def __init__(self):
        self.active_connections = {}

    async def connect(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)

        logging.info(f"✅ WebSocket connected for user: {user_id}")
        print(f"✅ WebSocket connected for user: {user_id}")  # Manually print

    async def disconnect(self, user_id: str, websocket: WebSocket):
        if user_id in self.active_connections:
            self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]

        logging.info(f"❌ WebSocket disconnected for user: {user_id}")
        print(f"❌ WebSocket disconnected for user: {user_id}")  # Manually print

    async def send_message(self, user_id: str, message: str):
        if user_id in self.active_connections:
            for websocket in self.active_connections[user_id]:
                await websocket.send_text(message)
                logging.info(f"📩 Sent WebSocket message to {user_id}: {message}")
                print(f"📩 Sent WebSocket message to {user_id}: {message}")


websocket_manager = WebSocketManager()
