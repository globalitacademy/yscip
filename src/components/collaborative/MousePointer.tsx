
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface PointerUser {
  id: string;
  name: string;
  color: string;
  position: { x: number; y: number };
  isCurrentUser?: boolean;
  zIndex?: number;
  role?: string; // Added role field
}

interface MousePointerProps {
  user: PointerUser;
}

const MousePointer: React.FC<MousePointerProps> = ({ user }) => {
  const { name, color, position, isCurrentUser, zIndex = 50, role } = user;
  const [displayedRole, setDisplayedRole] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Typing animation effect for the role
  useEffect(() => {
    if (!role) return;
    
    let currentText = '';
    let currentIndex = 0;
    setIsTyping(true);
    
    const typeRole = () => {
      if (currentIndex < role.length) {
        currentText += role.charAt(currentIndex);
        setDisplayedRole(currentText);
        currentIndex++;
        typingTimeout.current = setTimeout(typeRole, 100); // Adjust speed here
      } else {
        setIsTyping(false);
      }
    };
    
    // Start typing after a small delay
    typingTimeout.current = setTimeout(typeRole, 500);
    
    return () => {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
    };
  }, [role]);
  
  return (
    <div 
      className="absolute pointer-events-none select-none"
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
        className="pointer-events-none"
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
          "shadow-sm pointer-events-none select-none flex flex-col items-center"
        )}
        style={{ 
          backgroundColor: color,
          top: "-8px"
        }}
      >
        <span>{name}</span>
        {role && (
          <span className={cn(
            "text-[10px] opacity-90 font-light",
            isTyping ? "border-r-2 border-white/70 pr-0.5" : ""
          )}>
            {displayedRole}
          </span>
        )}
      </div>
    </div>
  );
};

export default MousePointer;
