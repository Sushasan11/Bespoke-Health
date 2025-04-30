import API from "../utils/axios";

class ChatService {
  
  async getChatRoom(appointmentId) {
    try {
      const response = await API.get(`/chat/appointment/${appointmentId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting chat room:", error);
      throw error.response?.data || { error: "Failed to get chat room" };
    }
  }

  
  async getMessages(chatRoomId, page = 1, limit = 20) {
    try {
      if (!chatRoomId) {
        throw new Error("Chat room ID is required");
      }
      
      console.log(`Fetching messages for chat room ${chatRoomId}, page: ${page}, limit: ${limit}`);
      
      const response = await API.get(`/chat/messages/${chatRoomId}`, {
        params: { page, limit }
      });
      
      console.log(`Received ${response.data.messages?.length || 0} messages for chat room ${chatRoomId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching messages for chat room ${chatRoomId}:`, error);
      throw error.response?.data || { error: "Failed to fetch messages" };
    }
  }

  
  async sendMessage(chatRoomId, content, attachment = null) {
    try {
      if (!chatRoomId) {
        throw new Error("Chat room ID is required");
      }
      
      const formData = new FormData();
      
      
      formData.append("content", content || "");
      
      if (attachment) {
        formData.append("attachment", attachment);
      }

      console.log(`Sending message to chat room ${chatRoomId}:`, { 
        content, 
        hasAttachment: !!attachment 
      });
      
      const response = await API.post(`/chat/messages/${chatRoomId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      
      console.log("Message sent successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error sending message to chat room ${chatRoomId}:`, error);
      throw error.response?.data || { error: "Failed to send message" };
    }
  }

  
  async getUnreadCounts() {
    try {
      const response = await API.get("/chat/unread");
      return response.data;
    } catch (error) {
      console.error("Error fetching unread counts:", error);
      throw error.response?.data || { error: "Failed to fetch unread counts" };
    }
  }

  
  async getChatRooms(page = 1, limit = 10) {
    try {
      const response = await API.get("/chat/rooms", {
        params: { page, limit }
      });
      console.log("Chat rooms fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
      throw error.response?.data || { error: "Failed to fetch chat rooms" };
    }
  }
}

export default new ChatService();