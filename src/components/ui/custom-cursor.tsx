
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface CustomCursorProps {
  className?: string;
}

export const CustomCursor = ({ className }: CustomCursorProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);
    
    // Track when cursor is over interactive elements
    const handleHoverStart = () => setIsHovering(true);
    const handleHoverEnd = () => setIsHovering(false);

    // Add hover detection for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, [role="button"]');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleHoverStart);
      el.addEventListener('mouseleave', handleHoverEnd);
    });

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleHoverStart);
        el.removeEventListener('mouseleave', handleHoverEnd);
      });
    };
  }, [isVisible, isHovering]);

  return (
    <div
      className={cn(
        'fixed pointer-events-none z-50 transition-opacity duration-300',
        isVisible ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      <div 
        className={cn(
          'relative flex items-center justify-center',
          'transition-all duration-200 ease-out',
          isClicking ? 'scale-90' : 'scale-100'
        )}
      >
        {/* Main cursor circle */}
        <div 
          className={cn(
            'absolute rounded-full backdrop-blur-sm',
            'transition-all duration-150',
            isHovering ? 'h-8 w-8 -ml-4 -mt-4 bg-primary/40' : 'h-6 w-6 -ml-3 -mt-3 bg-primary/20'
          )} 
        />
        
        {/* Center dot */}
        <div 
          className={cn(
            'absolute rounded-full bg-primary/30',
            isHovering ? 'h-1.5 w-1.5' : 'h-2 w-2'
          )} 
        />
      </div>
    </div>
  );
};
