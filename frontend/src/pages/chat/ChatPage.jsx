import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import ChatWindow from "../../components/chat/ChatWindow";
import ChatRoomsList from "../../components/chat/ChatRoomsList";
import { useChat } from "../../context/ChatContext";
import { toast } from "sonner";

const ChatPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    openChatForAppointment, 
    openChatRoom,
    activeChat,
    fetchChatRooms
  } = useChat();
  const [loading, setLoading] = useState(false);
  const [showChatList, setShowChatList] = useState(true);
  
  useEffect(() => {
    
    fetchChatRooms().catch(error => {
      console.error("Failed to fetch chat rooms:", error);
    });
    
    const params = new URLSearchParams(location.search);
    const appointmentId = params.get("appointment");
    
    if (appointmentId) {
      initializeChat(appointmentId);
    }
  }, []);
  
  const initializeChat = async (appointmentId) => {
    try {
      setLoading(true);
      await openChatForAppointment(appointmentId);
      
      
      navigate("/dashboard/chat", { replace: true });
    } catch (error) {
      toast.error("Failed to open chat. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSelectRoom = async (chatRoomId) => {
    try {
      setLoading(true);
      await openChatRoom(chatRoomId);
    } catch (error) {
      toast.error("Failed to open chat. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden h-[calc(100vh-200px)]">
          <div className="flex h-full">
            
            <div className={`${showChatList ? 'block' : 'hidden'} md:block w-full md:w-1/3 h-full border-r border-gray-200`}>
              <ChatRoomsList 
                onSelectRoom={(roomId) => {
                  handleSelectRoom(roomId);
                  setShowChatList(false); 
                }} 
              />
            </div>
            
            
            <div className={`${!showChatList ? 'block' : 'hidden'} md:block w-full md:w-2/3 h-full`}>
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
              ) : activeChat ? (
                <>
                  
                  <div className="md:hidden p-2 border-b border-gray-200">
                    <button
                      onClick={() => setShowChatList(true)}
                      className="flex items-center text-indigo-600"
                    >
                      <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                      Back to Chats
                    </button>
                  </div>
                  <ChatWindow />
                </>
              ) : (
                <div className="flex flex-col justify-center items-center h-full p-6 text-center">
                  
                  <div className="md:hidden w-full mb-4">
                    <button
                      onClick={() => setShowChatList(true)}
                      className="flex items-center text-indigo-600"
                    >
                      <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                      Back to Chats
                    </button>
                  </div>
                  
                  <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Select a Conversation</h3>
                  <p className="mt-1 text-gray-500">
                    Choose a chat from the list to view messages.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChatPage;