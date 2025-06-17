import React, { useState, useRef } from 'react';
import EmojiPicker from './EmojiPicker';

interface Props {
  onSend: (content: string) => void;
  onTyping?: () => void;
  onStopTyping?: () => void;
  disabled?: boolean;
}

/**
 * Common emoji shortcuts that users can type
 * Format: :shortcut: -> emoji
 */
const emojiShortcuts: Record<string, string> = {
  ':heart:': '❤️',
  ':love:': '💕',
  ':kiss:': '💋',
  ':kiss_face:': '😘',
  ':heart_eyes:': '😍',
  ':smiling_face_with_hearts:': '🥰',
  ':smile:': '😊',
  ':grin:': '😁',
  ':joy:': '😂',
  ':wink:': '😉',
  ':blush:': '😌',
  ':hugs:': '🤗',
  ':wave:': '👋',
  ':thumbs_up:': '👍',
  ':party:': '🎉',
  ':rose:': '🌹',
  ':sun:': '☀️',
  ':star:': '⭐',
  ':sparkles:': '✨'
};

/**
 * Converts emoji shortcuts in text to actual emojis
 */
const convertEmojiShortcuts = (text: string): string => {
  let convertedText = text;
  
  // Sort shortcuts by length (longest first) to avoid partial matches
  const sortedShortcuts = Object.keys(emojiShortcuts).sort((a, b) => b.length - a.length);
  
  for (const shortcut of sortedShortcuts) {
    const emoji = emojiShortcuts[shortcut];
    // Use global replace to handle multiple instances
    convertedText = convertedText.replace(new RegExp(escapeRegExp(shortcut), 'g'), emoji);
  }
  
  return convertedText;
};

/**
 * Escapes special regex characters in a string
 */
const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const MessageInput: React.FC<Props> = ({ onSend, onTyping, onStopTyping, disabled = false }) => {
  const [input, setInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      // Convert emoji shortcuts before sending
      const convertedMessage = convertEmojiShortcuts(input.trim());
      onSend(convertedMessage);
      setInput('');
      setShowEmojiPicker(false); // Close emoji picker when sending
      
      // Stop typing when message is sent
      if (onStopTyping) {
        onStopTyping();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    
    // Trigger typing indicator
    if (onTyping && e.target.value.length > 0) {
      onTyping();
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set timeout to stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        if (onStopTyping) {
          onStopTyping();
        }
      }, 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    } else if (e.key === 'Escape') {
      setShowEmojiPicker(false);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    // Insert emoji at cursor position
    const input = inputRef.current;
    if (input) {
      const cursorPosition = input.selectionStart || 0;
      const newValue = 
        input.value.substring(0, cursorPosition) + 
        emoji + 
        input.value.substring(cursorPosition);
      
      setInput(newValue);
      
      // Focus back to input and set cursor position after emoji
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(cursorPosition + emoji.length, cursorPosition + emoji.length);
      }, 10);
      
      // Trigger typing indicator when emoji is added
      if (onTyping) {
        onTyping();
        
        // Clear existing timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        
        // Set timeout to stop typing after 2 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
          if (onStopTyping) {
            onStopTyping();
          }
        }, 2000);
      }
    }
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  return (
    <div className="relative">
      {/* Emoji Picker */}
      <EmojiPicker
        isOpen={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        onEmojiSelect={handleEmojiSelect}
        anchorRef={emojiButtonRef}
      />
      
      {/* Message Input Form */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t p-4 bg-white"
      >
        <div className="flex-grow relative">
          <input
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? "Connecting..." : "Write a loving message... (try :heart: :smile:)"}
            disabled={disabled}
            className="w-full border border-pink-300 rounded-2xl px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          
          {/* Emoji Button */}
          <button
            ref={emojiButtonRef}
            type="button"
            onClick={toggleEmojiPicker}
            disabled={disabled}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              showEmojiPicker 
                ? 'bg-pink-100 text-pink-600' 
                : 'text-gray-400 hover:text-pink-500 hover:bg-pink-50'
            }`}
            title="Add emoji"
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8.5 9c.83 0 1.5-.67 1.5-1.5S9.33 6 8.5 6 7 6.67 7 7.5 7.67 9 8.5 9zm7 0c.83 0 1.5-.67 1.5-1.5S16.33 6 15.5 6 14 6.67 14 7.5 14.67 9 15.5 9zm-3.5 6.5c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z"/>
            </svg>
          </button>
        </div>
        
        {/* Send Button */}
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full shadow disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          title="Send message"
        >
          💌
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
