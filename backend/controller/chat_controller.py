from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services.chat_service import ConnectionManager

router = APIRouter(prefix="/ws", tags=["Chat"])

manager = ConnectionManager()


@router.websocket("/chat")
async def chat_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # For demo purposes, broadcast the received message to all connections.
            await manager.broadcast(f"Message: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast("A user has disconnected.")
