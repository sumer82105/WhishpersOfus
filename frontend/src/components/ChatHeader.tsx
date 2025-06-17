import React from 'react';
import { motion } from 'framer-motion';

interface ChatHeaderProps {
  partnerName: string;
  unreadCount?: number;
  isConnected?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ partnerName, unreadCount = 0, isConnected = false }) => (
  <div className="bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 font-semibold text-lg px-6 py-4 border-b border-pink-200/50 shadow-sm">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ❤️
        </motion.div>
        <span>Chat with {partnerName}</span>
        {isConnected && (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600">Online</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.div>
        )}
      </div>
    </div>
  </div>
);

export default ChatHeader;
