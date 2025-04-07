
import React from 'react';
import { cn } from '@/lib/utils';

export interface PointerUser {
  id: string;
  name: string;
  color: string;
  position: { x: number; y: number };
  isCurrentUser?: boolean;
  zIndex?: number;
}

interface MousePointerProps {
  user: PointerUser;
}

const MousePointer: React.FC<MousePointerProps> = ({ user }) => {
  const { name, color, position, isCurrentUser, zIndex = 50 } = user;
  
  return (
    <div 
      className="absolute pointer-events-none"
      style={{ 
        left: 0,
        top: 0,
        transform: `translate(${position.x}px, ${position.y}px)`,
        zIndex,
        transition: isCurrentUser ? 'none' : 'transform 500ms cubic-bezier(0.25, 1, 0.5, 1)'
      }}
    >
      {/* Pointer SVG */}
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.25))' }}
      >
        <path 
          d="M5.5 3.5L18 14.5L12.5 15.5L10 20.5L5.5 3.5Z" 
          fill={color} 
          stroke="white" 
          strokeWidth="1.5" 
        />
      </svg>
      
      {/* User name label */}
      <div 
        className={cn(
          "absolute px-2 py-0.5 rounded text-xs font-medium text-white",
          "whitespace-nowrap transform -translate-y-full -translate-x-1/4",
          "animate-pulse shadow-sm"
        )}
        style={{ 
          backgroundColor: color,
          top: "-8px",
          animationDuration: "2s"
        }}
      >
        {name}
      </div>
    </div>
  );
};

export default MousePointer;
