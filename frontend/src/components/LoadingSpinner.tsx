import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="relative w-20 h-20">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`
              absolute inset-0
              border-4 border-pink-200
              rounded-full
              animate-ping
              opacity-75
              delay-${i * 300}
            `}
            style={{
              animationDelay: `${i * 300}ms`,
              animationDuration: '2s'
            }}
          >
            ❤️
          </div>
        ))}
      </div>
    </div>
  );
}; 