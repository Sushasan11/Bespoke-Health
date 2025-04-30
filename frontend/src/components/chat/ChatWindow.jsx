import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";

const ChatWindow = () => {
  const { user } = useAuth();
  const {
    activeChat,
    messages,
    isLoadingMessages,
    usersTyping,
    sendMessage,
    sendTypingStatus,
    fetchMessages,
  } = useChat();

  const [messageText, setMessageText] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  const messageEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTyping = () => {
    sendTypingStatus(true);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(() => {
      sendTypingStatus(false);
    }, 2000);

    setTypingTimeout(timeout);
  };

  const handleMessageChange = (e) => {
    setMessageText(e.target.value);
    handleTyping();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
      ];
      const maxSize = 5 * 1024 * 1024;

      if (!allowedTypes.includes(file.type)) {
        toast.error("Only images (JPEG, PNG, GIF) and PDF files are allowed");
        return;
      }

      if (file.size > maxSize) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setAttachment(file);
    }
  };

  const clearAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ((!messageText.trim() && !attachment) || isSending) {
      return;
    }

    try {
      setIsSending(true);

      const trimmedContent = messageText.trim();
      const currentAttachment = attachment;

      setMessageText("");
      clearAttachment();

      console.log("Sending message:", {
        content: trimmedContent,
        hasAttachment: !!currentAttachment,
        chatRoomId: activeChat.id,
      });

      const sentMessage = await sendMessage(trimmedContent, currentAttachment);
      console.log("Message sent successfully:", sentMessage);

      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (timestamp) => {
    try {
      return format(new Date(timestamp), "h:mm a");
    } catch (error) {
      return "";
    }
  };

  const typingUsers = Object.values(usersTyping).filter(Boolean);

  useEffect(() => {
    if (activeChat?.id) {
      const fetchInitialMessages = async () => {
        try {
          await fetchMessages(activeChat.id);
        } catch (error) {
          console.error("Could not fetch initial messages:", error);
        }
      };

      fetchInitialMessages();

      const messagePollingInterval = setInterval(() => {
        if (activeChat?.id) {
          fetchMessages(activeChat.id).catch(console.error);
        }
      }, 10000);

      return () => clearInterval(messagePollingInterval);
    }
  }, [activeChat?.id]);

  if (!activeChat) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-xl">
          {activeChat.otherParticipant?.name?.charAt(0).toUpperCase() || "?"}
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-lg font-semibold">
            {activeChat.otherParticipant?.name || "Chat"}
          </h3>
          <p className="text-sm text-gray-500">
            {new Date(
              activeChat.appointmentDetails?.date
            ).toLocaleDateString() || ""}
          </p>
        </div>
        <div className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
          {activeChat.appointmentDetails?.status || ""}
        </div>
      </div>

      
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {isLoadingMessages ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-indigo-100 rounded-full p-3">
              <svg
                className="w-8 h-8 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="mt-4 text-gray-500 max-w-xs">
              No messages yet. Start the conversation with{" "}
              {activeChat.otherParticipant?.name || "them"}.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div
                key={message.id || index}
                className={`flex ${
                  message.isMine ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                    message.isMine
                      ? "bg-indigo-600 text-white"
                      : "bg-white border border-gray-200 text-gray-800"
                  }`}
                >
                  {message.content && <p>{message.content}</p>}

                  {message.attachmentUrl && (
                    <div className="mt-2">
                      {message.attachmentUrl.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                        <img
                          src={message.attachmentUrl}
                          alt="Attachment"
                          className="max-w-full rounded max-h-60 object-contain"
                          onClick={() => window.open(message.attachmentUrl)}
                        />
                      ) : message.attachmentUrl.match(/\.(pdf)$/i) ? (
                        <a
                          href={message.attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-500 hover:underline"
                        >
                          <svg
                            className="w-5 h-5 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                          View Document
                        </a>
                      ) : (
                        <a
                          href={message.attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          Download Attachment
                        </a>
                      )}
                    </div>
                  )}

                  <div
                    className={`text-xs mt-1 text-right ${
                      message.isMine ? "text-indigo-100" : "text-gray-500"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}

            {typingUsers.length > 0 && (
              <div className="flex items-center space-x-1 text-gray-500 text-sm pl-2">
                <div className="flex space-x-1">
                  <div className="animate-bounce w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <div className="animate-bounce delay-75 w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <div className="animate-bounce delay-150 w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                </div>
                <span>
                  {typingUsers.length === 1
                    ? `${typingUsers[0].username} is typing...`
                    : "Multiple people are typing..."}
                </span>
              </div>
            )}

            <div ref={messageEndRef} />
          </div>
        )}
      </div>

      
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex flex-col">
          
          {attachment && (
            <div className="mb-2 p-2 bg-gray-50 rounded border border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-gray-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
                <span className="text-sm truncate max-w-xs">
                  {attachment.name}
                </span>
              </div>
              <button
                type="button"
                onClick={clearAttachment}
                className="text-red-500 hover:text-red-700"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}

          
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-full text-gray-500 hover:text-indigo-600 hover:bg-gray-100"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/jpeg,image/png,image/gif,application/pdf"
            />

            <input
              type="text"
              value={messageText}
              onChange={handleMessageChange}
              placeholder="Type your message..."
              className="flex-1 ml-2 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />

            <button
              type="submit"
              disabled={(!messageText.trim() && !attachment) || isSending}
              className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
