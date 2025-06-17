import React from 'react';

interface MessageProps {
  content: string;
  senderId: string;
  timestamp: string;
  isOwn: boolean;
}

/**
 * Utility function to detect if a message contains only emojis
 * @param text - The message content to check
 * @returns true if the message contains only emojis (and whitespace)
 */
const isEmojiOnlyMessage = (text: string): boolean => {
  // Remove all whitespace
  const trimmed = text.replace(/\s/g, '');
  
  // Check if empty after removing whitespace
  if (!trimmed) return false;
  
  // Regex to match emoji characters (including skin tone modifiers, combining characters, etc.)
  const emojiRegex = /^[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]|[\u{238C}-\u{2454}]|[\u{20D0}-\u{20FF}]|[\u{FE0F}]|[\u{200D}]+$/u;
  
  // For simplicity, we'll use a more basic check
  // This checks if the string contains common emoji ranges
  const hasEmoji = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]|[\u{238C}-\u{2454}]|❤️|💕|💖|💗|💓|💝|💘|💟|💌|💋|😍|🥰|😘|💑|💏|👨‍❤️‍👩|👩‍❤️‍👨|👨‍❤️‍👨|👩‍❤️‍👩|💐|🌹|🌺|🌻|🌷/u.test(trimmed);
  
  // Check if it's less than 10 characters and contains emojis
  // This is a simple heuristic - adjust as needed
  return hasEmoji && trimmed.length <= 10;
};

const MessageBubble: React.FC<MessageProps> = ({ content, senderId, timestamp, isOwn }) => {
  const isEmojiOnly = isEmojiOnlyMessage(content);
  
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`${
          isEmojiOnly 
            ? 'px-2 py-1 bg-transparent' // Emoji-only messages have minimal styling
            : `max-w-xs px-4 py-2 rounded-2xl shadow-md text-white ${
                isOwn ? 'bg-pink-500 rounded-br-none' : 'bg-rose-400 rounded-bl-none'
              }`
        }`}
      >
        {isEmojiOnly ? (
          <>
            <p className="text-4xl text-center mb-1">{content}</p>
            <p className="text-xs text-center text-gray-500 opacity-70">
              {new Date(timestamp).toLocaleTimeString()}
            </p>
          </>
        ) : (
          <>
            <p className="whitespace-pre-wrap">{content}</p>
            <p className="text-xs text-right opacity-70 mt-1">
              {new Date(timestamp).toLocaleTimeString()}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
