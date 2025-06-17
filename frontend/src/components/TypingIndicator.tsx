import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-1 text-gray-500">
      <span className="text-sm">typing</span>
      <div className="flex space-x-1">
        {[0, 1, 2].map((dot) => (
          <motion.div
            key={dot}
            className="w-1 h-1 bg-gray-400 rounded-full"
            animate={{ y: [0, -4, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: dot * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default TypingIndicator;
