import { createContext, useContext, useEffect, useState } from "react";
import useWebSocket from "../hooks/useWebSocket";

const NotificationContext = createContext();

export const NotificationProvider = ({ children, userId }) => {
  {
    /* Fetch Real-Time Notifications via WebSocket */
  }
  const messages = useWebSocket(userId);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (messages.length > 0) {
      setNotifications((prev) => [...prev, messages[messages.length - 1]]);
    }
  }, [messages]);

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
