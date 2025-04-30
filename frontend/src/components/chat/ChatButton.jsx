import { useState } from "react";
import { toast } from "sonner";
import { useChat } from "../../context/ChatContext";

const ChatButton = ({ appointmentId, className }) => {
  const { openChatForAppointment, unreadCounts } = useChat();
  const [loading, setLoading] = useState(false);
  
  const handleOpenChat = async () => {
    try {
      setLoading(true);
      await openChatForAppointment(appointmentId);
      
      window.location.href = `/dashboard/chat?appointment=${appointmentId}`;
    } catch (error) {
      toast.error("Could not open chat. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const unreadCount = unreadCounts[appointmentId] || 0;
  
  return (
    <button
      onClick={handleOpenChat}
      disabled={loading}
      className={`relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${className}`}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      )}
      Chat with {appointmentId ? "Doctor" : "Patient"}
      
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
          {unreadCount}
        </span>
      )}
    </button>
  );
};

export default ChatButton;