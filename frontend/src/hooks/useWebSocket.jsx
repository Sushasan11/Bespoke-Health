import { useEffect, useState } from "react";

const useWebSocket = (userId) => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!userId) return;

    let ws;
    let reconnectTimeout;

    const connectWebSocket = () => {
      // Retrieve session token from cookies
      const sessionToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("session_token="))
        ?.split("=")[1];

      if (!sessionToken) {
        console.error(
          "WebSocket authentication failed: No session token found."
        );
        return;
      }

      // Establish WebSocket Connection
      ws = new WebSocket(`ws://127.0.0.1:8000/ws/${userId}`);

      ws.onopen = () => {
        ws.send(JSON.stringify({ type: "AUTH", token: sessionToken }));
      };

      ws.onmessage = (event) => {
        try {
          const messageData = JSON.parse(event.data);
          setMessages((prev) => [...prev, messageData]);
        } catch (error) {
          console.error("WebSocket message parsing error:", error);
        }
      };

      ws.onclose = () => {
        reconnectTimeout = setTimeout(connectWebSocket, 5000);
      };

      ws.onerror = (error) => {
        console.error("WebSocket encountered an error:", error);
        ws.close();
      };

      setSocket(ws);
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.onclose = null;
        ws.close();
      }
      clearTimeout(reconnectTimeout);
    };
  }, [userId]);

  return messages;
};

export default useWebSocket;
