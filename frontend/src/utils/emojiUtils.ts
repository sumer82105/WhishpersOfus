/**
 * Emoji utilities for the chat application
 * Provides shortcuts and helper functions for emoji handling
 */

/**
 * Common emoji shortcuts that users can type
 * Format: :shortcut: -> emoji
 */
export const emojiShortcuts: Record<string, string> = {
  // Love & Hearts
  ':heart:': '❤️',
  ':love:': '💕',
  ':kiss:': '💋',
  ':kiss_face:': '😘',
  ':heart_eyes:': '😍',
  ':smiling_face_with_hearts:': '🥰',
  ':love_letter:': '💌',
  ':couple:': '💑',
  ':couple_kiss:': '💏',
  ':bouquet:': '💐',
  ':rose:': '🌹',

  // Emotions
  ':smile:': '😊',
  ':grin:': '😁',
  ':joy:': '😂',
  ':wink:': '😉',
  ':blush:': '😌',
  ':hugs:': '🤗',
  ':pleading:': '🥺',
  ':cry:': '😢',
  ':sob:': '😭',

  // Gestures
  ':wave:': '👋',
  ':ok:': '👌',
  ':thumbs_up:': '👍',
  ':thumbs_down:': '👎',
  ':clap:': '👏',
  ':pray:': '🙌',
  ':point_right:': '👉',
  ':point_left:': '👈',

  // Celebration
  ':party:': '🎉',
  ':confetti:': '🎊',
  ':party_face:': '🥳',
  ':balloon:': '🎈',
  ':gift:': '🎁',
  ':trophy:': '🏆',
  ':cheers:': '🥂',
  ':cake:': '🎂',

  // Nature
  ':cherry_blossom:': '🌸',
  ':hibiscus:': '🌺',
  ':sunflower:': '🌻',
  ':tulip:': '🌷',
  ':sun:': '☀️',
  ':moon:': '🌙',
  ':star:': '⭐',
  ':sparkles:': '✨',
  ':rainbow:': '🌈',

  // Food
  ':cake:': '🍰',
  ':cupcake:': '🧁',
  ':cookie:': '🍪',
  ':chocolate:': '🍫',
  ':candy:': '🍬',
  ':strawberry:': '🍓',
  ':coffee:': '☕',
  ':honey:': '🍯'
};

/**
 * Converts emoji shortcuts in text to actual emojis
 * @param text - The text potentially containing emoji shortcuts
 * @returns The text with shortcuts replaced by emojis
 */
export const convertEmojiShortcuts = (text: string): string => {
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
 * @param string - The string to escape
 * @returns The escaped string
 */
const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Detects if a message contains only emojis
 * @param text - The message content to check
 * @returns true if the message contains only emojis (and whitespace)
 */
export const isEmojiOnlyMessage = (text: string): boolean => {
  // Remove all whitespace
  const trimmed = text.replace(/\s/g, '');
  
  // Check if empty after removing whitespace
  if (!trimmed) return false;
  
  // Check if it's less than 15 characters and contains emojis
  if (trimmed.length > 15) return false;
  
  // Basic emoji detection - covers most common emoji ranges
  const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]|[\u{238C}-\u{2454}]|❤️|💕|💖|💗|💓|💝|💘|💟|💌|💋|😍|🥰|😘|💑|💏|👨‍❤️‍👩|👩‍❤️‍👨|👨‍❤️‍👨|👩‍❤️‍👩|💐|🌹|🌺|🌻|🌷/u;
  
  // Count actual characters (not emoji modifiers)
  const charCount = Array.from(trimmed).length;
  const emojiMatches = trimmed.match(new RegExp(emojiRegex.source, 'gu'));
  
  // If most of the content is emojis, consider it emoji-only
  return emojiMatches && emojiMatches.length >= charCount * 0.7;
};

/**
 * Gets a random romantic emoji for reactions
 * @returns A random romantic emoji
 */
export const getRandomRomanticEmoji = (): string => {
  const romanticEmojis = [
    '❤️', '💕', '💖', '💗', '💓', '💝', '💘', '💟',
    '💌', '💋', '😍', '🥰', '😘', '🌹', '💐', '✨'
  ];
  
  return romanticEmojis[Math.floor(Math.random() * romanticEmojis.length)];
};

/**
 * Formats message content by converting shortcuts and handling emojis
 * @param content - The raw message content
 * @returns The formatted content ready for display
 */
export const formatMessageContent = (content: string): string => {
  return convertEmojiShortcuts(content);
}; 