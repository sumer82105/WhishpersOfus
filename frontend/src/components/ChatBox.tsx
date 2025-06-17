import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

interface ChatBoxProps {
  messages: {
    id: string;
    content: string;
    senderId: string;
    timestamp: string;
  }[];
  currentUserId: string;
  typingUsers?: string[];
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages, currentUserId, typingUsers = [] }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 py-2 bg-pink-50">
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          content={msg.content}
          senderId={msg.senderId}
          timestamp={msg.timestamp}
          isOwn={msg.senderId === currentUserId}
        />
      ))}
      
      {/* Typing Indicators */}
      {typingUsers.length > 0 && (
        <div className="flex justify-start mb-2">
          <div className="max-w-xs px-4 py-2 rounded-2xl bg-gray-200 text-gray-600">
            <TypingIndicator />
          </div>
        </div>
      )}
      
      <div ref={endRef}></div>
    </div>
  );
};

export default ChatBox;
