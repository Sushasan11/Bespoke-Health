from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from services.notification_service import websocket_manager
from services.session_service import SessionService

router = APIRouter(prefix="/ws", tags=["Notifications"])


# Authenticate WebSocket Connection
async def authenticate_websocket(websocket: WebSocket):
    session_token = websocket.headers.get("session_token")

    if not session_token:
        await websocket.close(code=403)
        return None

    try:
        user_id, role = SessionService.get_session_user_from_token(session_token)
        return user_id
    except Exception:
        await websocket.close(code=403)
        return None


# WebSocket Endpoint for User Notifications
@router.websocket("/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    authenticated_user = await authenticate_websocket(websocket)

    if authenticated_user is None or str(authenticated_user) != user_id:
        return

    await websocket_manager.connect(user_id, websocket)

    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        await websocket_manager.disconnect(user_id, websocket)


# Test API to Send a WebSocket Notification
@router.post("/send-test-notification/")
async def send_test_notification(user_id: str, message: str):
    await websocket_manager.send_message(user_id, message)
    return {"status": "Notification sent", "user_id": user_id, "message": message}
