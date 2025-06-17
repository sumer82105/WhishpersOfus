import React, { useState, useRef, useEffect } from 'react';

interface EmojiPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onEmojiSelect: (emoji: string) => void;
  anchorRef: React.RefObject<HTMLElement>;
}

/**
 * Emoji data organized by categories
 * Focused on romantic, emotional, and relationship-relevant emojis
 */
const emojiCategories = {
  love: {
    name: 'Love & Hearts',
    icon: '❤️',
    emojis: [
      '❤️', '💕', '💖', '💗', '💓', '💝', '💘', '💟',
      '💌', '💋', '😍', '🥰', '😘', '💑', '💏', '👨‍❤️‍👩',
      '👩‍❤️‍👨', '👨‍❤️‍👨', '👩‍❤️‍👩', '💐', '🌹', '🌺', '🌻', '🌷'
    ]
  },
  emotions: {
    name: 'Emotions',
    icon: '😊',
    emojis: [
      '😊', '😄', '😃', '😁', '😆', '😂', '🤣', '🥲',
      '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘',
      '😗', '😙', '😚', '🤗', '🤭', '🥺', '😢', '😭'
    ]
  },
  gestures: {
    name: 'Gestures',
    icon: '👋',
    emojis: [
      '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏',
      '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆',
      '🖕', '👇', '☝️', '👍', '👎', '👏', '🙌', '👐'
    ]
  },
  celebration: {
    name: 'Celebration',
    icon: '🎉',
    emojis: [
      '🎉', '🎊', '🥳', '🎈', '🎁', '🎀', '🏆', '🥇',
      '🎯', '🎪', '🎭', '🎨', '🎵', '🎶', '🎤', '🎧',
      '🍾', '🥂', '🍻', '🍷', '🍸', '🍹', '🧁', '🎂'
    ]
  },
  nature: {
    name: 'Nature',
    icon: '🌸',
    emojis: [
      '🌸', '🌺', '🌻', '🌹', '🌷', '🌼', '🌿', '🍀',
      '🌳', '🌲', '🌴', '🌵', '🌾', '🌱', '☀️', '🌙',
      '⭐', '🌟', '✨', '💫', '🌈', '☁️', '⛅', '🌤️'
    ]
  },
  food: {
    name: 'Food & Treats',
    icon: '🍰',
    emojis: [
      '🍰', '🧁', '🍪', '🍫', '🍬', '🍭', '🍩', '🍨',
      '🍦', '🍓', '🍒', '🍑', '🍊', '🍉', '🍇', '🍌',
      '🥝', '🍍', '🥭', '🍎', '🍏', '🍯', '🥛', '☕'
    ]
  }
};

/**
 * EmojiPicker component
 * Provides an organized emoji selection interface for chat messages
 */
const EmojiPicker: React.FC<EmojiPickerProps> = ({ 
  isOpen, 
  onClose, 
  onEmojiSelect, 
  anchorRef 
}) => {
  const [activeCategory, setActiveCategory] = useState('love');
  const pickerRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the emoji picker to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, anchorRef]);

  // Handle emoji selection
  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={pickerRef}
      className="absolute bottom-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg w-80 h-96 flex flex-col z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700">Pick an emoji</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-lg leading-none"
        >
          ×
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex border-b border-gray-200 px-2 py-1 overflow-x-auto">
        {Object.entries(emojiCategories).map(([key, category]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`flex-shrink-0 px-3 py-2 text-lg rounded-md transition-colors ${
              activeCategory === key
                ? 'bg-pink-100 text-pink-600'
                : 'hover:bg-gray-100'
            }`}
            title={category.name}
          >
            {category.icon}
          </button>
        ))}
      </div>

      {/* Category Name */}
      <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
        <span className="text-xs font-medium text-gray-600">
          {emojiCategories[activeCategory as keyof typeof emojiCategories].name}
        </span>
      </div>

      {/* Emoji Grid */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-8 gap-1">
          {emojiCategories[activeCategory as keyof typeof emojiCategories].emojis.map((emoji, index) => (
            <button
              key={`${emoji}-${index}`}
              onClick={() => handleEmojiClick(emoji)}
              className="w-8 h-8 flex items-center justify-center text-lg rounded hover:bg-gray-100 transition-colors"
              title={emoji}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Footer with frequently used emojis */}
      <div className="border-t border-gray-200 p-2">
        <div className="text-xs text-gray-500 mb-1">Frequently used</div>
        <div className="flex gap-1">
          {['❤️', '😘', '😍', '💕', '😊', '😂', '🥰', '💋'].map((emoji, index) => (
            <button
              key={`frequent-${emoji}-${index}`}
              onClick={() => handleEmojiClick(emoji)}
              className="w-6 h-6 flex items-center justify-center text-sm rounded hover:bg-gray-100 transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmojiPicker; 