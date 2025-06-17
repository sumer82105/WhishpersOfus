import React from 'react';

export const FloatingHearts: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`
              absolute animate-float
              w-4 h-4 md:w-6 md:h-6
              opacity-30 text-pink-400
              transform rotate-45
              left-[${Math.random() * 100}%]
              animation-delay-${Math.floor(Math.random() * 5000)}
            `}
          >
            ❤️
          </div>
        ))}
      </div>
    </div>
  );
}; 