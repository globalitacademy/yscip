
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { CollaborativePointers } from '@/components/collaborative';
import { useLocation } from 'react-router-dom';

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
  const location = useLocation();
  
  // Only show cursor on the home page
  const isHomePage = location.pathname === '/';
  
  useEffect(() => {
    if (!isHomePage) return;
    
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

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
    };
  }, [isVisible, isHomePage]);

  // Don't render if not on homepage
  if (!isHomePage) return null;

  return (
    <>
      {/* Custom cursor */}
      <div
        className={cn(
          'fixed pointer-events-none z-[999] transition-opacity duration-300',
          isVisible ? 'opacity-100' : 'opacity-0',
          className
        )}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      >
        <div 
          className={cn(
            'relative flex items-center justify-center',
            'h-6 w-6 -ml-3 -mt-3',
            'transition-all duration-200 ease-out',
            isClicking ? 'scale-90' : 'scale-100'
          )}
        >
          <div className="absolute rounded-full bg-primary/20 h-full w-full backdrop-blur-sm" />
          <div className="absolute rounded-full bg-primary/30 h-2 w-2" />
        </div>
      </div>
      
      {/* Virtual collaborative pointers - only on homepage */}
      {showVirtualPointers && (
        <CollaborativePointers 
          virtualUsersCount={virtualUsersCount}
          currentUserName="Դուք"
          currentUserColor="hsl(var(--primary))"
          currentUserRole="Ուսանող"
          enabled={isHomePage}
        />
      )}
    </>
  );
};
