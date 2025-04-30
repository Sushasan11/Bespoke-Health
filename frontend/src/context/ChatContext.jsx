import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import ChatService from "../services/ChatService";
import WebSocketService from "../services/WebSocketService";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user, isAuthenticated, token } = useAuth();
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [totalUnread, setTotalUnread] = useState(0);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [usersTyping, setUsersTyping] = useState({});
  const [chatRooms, setChatRooms] = useState([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  const [roomsPagination, setRoomsPagination] = useState({
    total: 0,
    page: 1,
    pages: 1
  });
  
  
  const fetchMessages = async (chatRoomId, page = 1, limit = 20) => {
    if (!chatRoomId) {
      console.error("Cannot fetch messages: No chat room ID provided");
      return { messages: [] };
    }
    
    try {
      setIsLoadingMessages(true);
      console.log("Fetching messages for chat room:", chatRoomId);
      
      const data = await ChatService.getMessages(chatRoomId, page, limit);
      console.log("Messages received:", data);
      
      
      const formattedMessages = (data.messages || []).map(msg => ({
        id: msg.id,
        content: msg.content,
        senderId: msg.sender_id,
        senderName: msg.sender_type,
        timestamp: msg.created_at,
        attachmentUrl: msg.attachment, 
        isMine: msg.isMine, 
        chatRoomId: chatRoomId
      }));
      
      
      const sortedMessages = [...formattedMessages].reverse();
      
      setMessages(sortedMessages);
      return data;
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      throw error;
    } finally {
      setIsLoadingMessages(false);
    }
  };

  
  const openChatForAppointment = async (appointmentId) => {
    try {
      const chatRoom = await ChatService.getChatRoom(appointmentId);
      console.log("Chat room response:", chatRoom); 
      
      
      setActiveChat({
        id: chatRoom.chatRoom.id, 
        appointmentId: appointmentId,
        otherParticipant: user.role === "Doctor" 
          ? chatRoom.appointment.patient 
          : chatRoom.appointment.doctor,
        appointmentDetails: chatRoom.appointment
      });
      
      
      WebSocketService.joinChatRoom(chatRoom.chatRoom.id);
      
      
      await fetchMessages(chatRoom.chatRoom.id);
      
      
      setUnreadCounts(prev => ({
        ...prev,
        [chatRoom.chatRoom.id]: 0
      }));
      
      return chatRoom;
    } catch (error) {
      console.error("Failed to open chat:", error);
      throw error;
    }
  };
  
  
  const sendMessage = async (content, attachment = null) => {
    if (!activeChat || !activeChat.id) {
      console.error("Cannot send message: No active chat or chat ID");
      throw new Error("No active chat selected");
    }
    
    try {
      console.log("Sending message to chat room:", activeChat.id, { content, hasAttachment: !!attachment });
      
      
      const response = await ChatService.sendMessage(activeChat.id, content, attachment);
      console.log("Message send response:", response);
      
      
      const newMessage = response.message || response;
      
      
      const formattedMessage = {
        id: newMessage.id || Date.now(),
        content: newMessage.content || content || "",
        senderId: user.id,
        senderName: user.name,
        timestamp: newMessage.created_at || new Date().toISOString(),
        attachmentUrl: newMessage.attachment || null,
        isMine: true,
        chatRoomId: activeChat.id
      };
      
      
      setMessages(prev => {
        
        const exists = prev.some(msg => msg.id === formattedMessage.id);
        if (!exists) {
          return [...prev, formattedMessage];
        }
        return prev;
      });
      
      return formattedMessage;
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  };
  
  
  const fetchChatRooms = async (page = 1, limit = 10) => {
    try {
      setIsLoadingRooms(true);
      const data = await ChatService.getChatRooms(page, limit);
      setChatRooms(data.chatRooms || []);
      setRoomsPagination(data.pagination || { total: 0, page: 1, pages: 1 });
      return data;
    } catch (error) {
      console.error("Failed to fetch chat rooms:", error);
      throw error;
    } finally {
      setIsLoadingRooms(false);
    }
  };

  
  const openChatRoom = async (chatRoomId) => {
    try {
      
      const room = chatRooms.find(r => r.id === chatRoomId);
      if (!room) {
        throw new Error("Chat room not found");
      }
      
      
      setActiveChat({
        id: room.id,
        appointmentId: room.appointment_id,
        otherParticipant: room.participant,
        appointmentDetails: {
          id: room.appointment_id,
          date: room.appointment_date,
          status: room.appointment_status
        }
      });
      
      
      WebSocketService.joinChatRoom(chatRoomId);
      
      
      await fetchMessages(chatRoomId);
      
      
      setUnreadCounts(prev => ({
        ...prev,
        [chatRoomId]: 0
      }));
      
      return room;
    } catch (error) {
      console.error("Failed to open chat room:", error);
      throw error;
    }
  };

  
  useEffect(() => {
    if (isAuthenticated && token) {
      WebSocketService.init(token);
      
      
      WebSocketService.on("new_message", (data) => {
        
        if (activeChat && data.chatRoomId === activeChat.id) {
          setMessages((prev) => [...prev, data.message]);
        } else {
          
          setUnreadCounts((prev) => ({
            ...prev,
            [data.chatRoomId]: (prev[data.chatRoomId] || 0) + 1
          }));
          updateTotalUnread();
        }
      });
      
      
      WebSocketService.on("user_typing", ({ chatRoomId, userId, username, typing }) => {
        if (activeChat && chatRoomId === activeChat.id && userId !== user?.id) {
          setUsersTyping(prev => ({
            ...prev,
            [userId]: typing ? { userId, username } : null
          }));
        }
      });
      
      
      fetchUnreadCounts();
      
      
      fetchChatRooms();
      
      
      const unreadCountsInterval = setInterval(fetchUnreadCounts, 60000);
      
      
      const chatRoomsInterval = setInterval(() => {
        fetchChatRooms(roomsPagination.page, 10);
      }, 30000);
      
      return () => {
        clearInterval(unreadCountsInterval);
        clearInterval(chatRoomsInterval);
        WebSocketService.off("new_message");
        WebSocketService.off("user_typing");
        WebSocketService.disconnect();
      };
    }
  }, [isAuthenticated, token, user?.id]);
  
  
  useEffect(() => {
    updateTotalUnread();
  }, [unreadCounts]);
  
  
  const fetchUnreadCounts = async () => {
    if (!isAuthenticated) return;
    
    try {
      const data = await ChatService.getUnreadCounts();
      setUnreadCounts(data.counts || {});
    } catch (error) {
      console.error("Failed to fetch unread counts:", error);
    }
  };
  
  
  const updateTotalUnread = () => {
    setTotalUnread(Object.values(unreadCounts).reduce((sum, count) => sum + count, 0));
  };
  
  
  const sendTypingStatus = (isTyping) => {
    if (!activeChat) return;
    
    WebSocketService.sendTypingStatus(activeChat.id, isTyping);
  };
  
  
  const closeChat = () => {
    setActiveChat(null);
    setMessages([]);
    setUsersTyping({});
  };
  
  const value = {
    activeChat,
    messages,
    unreadCounts,
    totalUnread,
    isLoadingMessages,
    usersTyping,
    chatRooms,
    isLoadingRooms,
    roomsPagination,
    openChatForAppointment,
    fetchMessages,
    sendMessage,
    sendTypingStatus,
    closeChat,
    fetchChatRooms,
    openChatRoom
  };
  
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};