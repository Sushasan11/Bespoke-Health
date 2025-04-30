import { useState } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { useChat } from "../../context/ChatContext";

const ChatRoomsList = ({ onSelectRoom }) => {
  const { 
    chatRooms, 
    isLoadingRooms, 
    roomsPagination, 
    fetchChatRooms,
    activeChat 
  } = useChat();
  
  const formatMessageTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      if (isToday(date)) {
        return format(date, "h:mm a");
      } else if (isYesterday(date)) {
        return "Yesterday";
      } else {
        return format(date, "MMM d");
      }
    } catch (error) {
      return "";
    }
  };
  
  const truncateMessage = (text, maxLength = 40) => {
    if (!text) return "";
    return text.length > maxLength 
      ? text.substring(0, maxLength) + "..."
      : text;
  };
  
  const handlePageChange = async (newPage) => {
    if (newPage >= 1 && newPage <= roomsPagination.pages) {
      await fetchChatRooms(newPage, 10);
    }
  };
  
  return (
    <div className="flex flex-col h-full border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Conversations</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {isLoadingRooms && chatRooms.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : chatRooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <p className="text-gray-500">No conversations yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {chatRooms.map((room) => (
              <li 
                key={room.id}
                className={`hover:bg-gray-50 cursor-pointer ${
                  activeChat?.id === room.id ? "bg-indigo-50" : ""
                }`}
                onClick={() => onSelectRoom(room.id)}
              >
                <div className="flex p-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-lg">
                      {room.participant.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">
                        {room.participant.name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatMessageTime(room.updated_at)}
                      </span>
                    </div>
                    
                    <div className="mt-1 flex justify-between">
                      <p className="text-sm text-gray-600 truncate max-w-[180px]">
                        {room.last_message 
                          ? room.last_message.hasAttachment 
                            ? "📎 Attachment" 
                            : truncateMessage(room.last_message.content)
                          : "No messages yet"}
                      </p>
                      
                      {room.unread_count > 0 && (
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-600 text-xs font-medium text-white">
                          {room.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {roomsPagination.pages > 1 && (
        <div className="p-3 border-t border-gray-200">
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => handlePageChange(roomsPagination.page - 1)}
              disabled={roomsPagination.page === 1}
              className={`px-2 py-1 rounded ${
                roomsPagination.page === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              &larr;
            </button>
            
            <span className="text-sm text-gray-600">
              Page {roomsPagination.page} of {roomsPagination.pages}
            </span>
            
            <button
              onClick={() => handlePageChange(roomsPagination.page + 1)}
              disabled={roomsPagination.page === roomsPagination.pages}
              className={`px-2 py-1 rounded ${
                roomsPagination.page === roomsPagination.pages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRoomsList;