import io from "socket.io-client";
import API from "../utils/axios";

class WebSocketService {
  socket = null;
  connected = false;
  listeners = {};

  
  init(token) {
    if (this.socket) {
      return;
    }

    this.socket = io("http://localhost:3000", {
      auth: {
        token
      },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000
    });

    this.setupListeners();
  }

  
  setupListeners() {
    this.socket.on("connect", () => {
      console.log("WebSocket connected");
      this.connected = true;
    });

    this.socket.on("disconnect", (reason) => {
      console.log("WebSocket disconnected:", reason);
      this.connected = false;
    });

    this.socket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  }

  
  joinChatRoom(chatRoomId) {
    if (!this.connected || !this.socket) {
      console.error("Cannot join chat: socket not connected");
      return;
    }

    this.socket.emit("join_chat", { chatRoomId });
  }

  
  sendTypingStatus(chatRoomId, isTyping) {
    if (!this.connected || !this.socket) {
      return;
    }

    this.socket.emit("typing", { chatRoomId, typing: isTyping });
  }

  
  on(event, callback) {
    if (!this.socket) {
      return;
    }

    
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    this.socket.on(event, callback);
  }

  
  off(event, callback) {
    if (!this.socket) {
      return;
    }
    
    if (callback && this.listeners[event]) {
      this.socket.off(event, callback);
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    } else {
      
      this.socket.off(event);
      this.listeners[event] = [];
    }
  }

  
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.listeners = {};
    }
  }
}

export default new WebSocketService();