
import React from 'react';

interface CustomCursorProps {
  mousePosition: { x: number; y: number };
  cursorVisible: boolean;
}

const CustomCursor: React.FC<CustomCursorProps> = ({ mousePosition, cursorVisible }) => {
  return (
    <div 
      className={`fixed w-8 h-8 rounded-full bg-primary/20 mix-blend-plus-lighter pointer-events-none z-50 transition-opacity duration-300 backdrop-blur-sm ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{
        left: `${mousePosition.x}px`,
        top: `${mousePosition.y}px`,
        transform: 'translate(-50%, -50%)',
        boxShadow: '0 0 20px 5px rgba(var(--primary), 0.2)'
      }}
    />
  );
};

export default CustomCursor;
