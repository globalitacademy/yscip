
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { CollaborativePointers } from '@/components/collaborative';

interface CustomCursorProps {
  className?: string;
  showVirtualPointers?: boolean;
  virtualUsersCount?: number;
}

export const CustomCursor = ({ 
  className,
  showVirtualPointers = true,
  virtualUsersCount = 3
}: CustomCursorProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Short timeout to ensure the cursor appears after component mount
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);

    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Add global event listeners
    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  return (
    <>
      {/* Custom cursor */}
      <div
        className={cn(
          'fixed pointer-events-none z-[999] transition-opacity duration-300',
          isVisible && isInitialized ? 'opacity-100' : 'opacity-0',
          className
        )}
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          willChange: 'transform'
        }}
      >
        <div 
          className={cn(
            'relative flex items-center justify-center',
            'h-7 w-7 -ml-3.5 -mt-3.5',
            'transition-all duration-100 ease-out',
            isClicking ? 'scale-75' : 'scale-100'
          )}
        >
          <div className="absolute rounded-full bg-primary/30 h-full w-full backdrop-blur-sm" />
          <div className="absolute rounded-full bg-primary/50 h-2.5 w-2.5" />
        </div>
      </div>
      
      {/* Virtual collaborative pointers */}
      {showVirtualPointers && (
        <CollaborativePointers 
          virtualUsersCount={virtualUsersCount}
          currentUserName="Դուք"
          currentUserColor="hsl(var(--primary))"
        />
      )}
    </>
  );
};
