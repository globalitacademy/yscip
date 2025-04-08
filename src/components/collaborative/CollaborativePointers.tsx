
import React, { useState, useEffect } from 'react';
import MousePointer, { PointerUser } from './MousePointer';

// Define virtual user colors
const VIRTUAL_USER_COLORS = [
  '#06b6d4', // cyan
  '#d946ef', // fuchsia
  '#f97316', // orange
  '#84cc16', // lime
  '#14b8a6', // teal
  '#f43f5e', // rose
];

// Armenian names for virtual collaborators
const VIRTUAL_NAMES = [
  'Արամ', 'Լիլիթ', 'Տիգրան', 'Անի',
  'Հայկ', 'Նարե', 'Վահան', 'Լուսինե'
];

// Roles in Armenian
const VIRTUAL_ROLES = [
  'Դասախոս', 'Ուսանող', 'Գործատու', 'Ուսանողուհի'
];

interface CollaborativePointersProps {
  virtualUsersCount?: number;
  currentUserName?: string;
  currentUserColor?: string;
  currentUserRole?: string;
  containerRef?: React.RefObject<HTMLElement>;
  enabled?: boolean;
}

const CollaborativePointers: React.FC<CollaborativePointersProps> = ({ 
  virtualUsersCount = 3, 
  currentUserName = 'Դուք', 
  currentUserColor = '#3b82f6', // blue
  currentUserRole = 'Ուսանող',
  containerRef,
  enabled = true
}) => {
  const [users, setUsers] = useState<PointerUser[]>([]);
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);
  
  // Don't render if not enabled
  if (!enabled) return null;
  
  // Initialize users including current user and virtual users
  useEffect(() => {
    const initialUsers: PointerUser[] = [
      // Current user
      {
        id: 'current-user',
        name: currentUserName,
        color: currentUserColor,
        position: { x: 0, y: 0 },
        isCurrentUser: true,
        zIndex: 100, // Highest z-index for current user
        role: currentUserRole
      }
    ];
    
    // Add virtual users
    for (let i = 0; i < virtualUsersCount; i++) {
      initialUsers.push({
        id: `virtual-user-${i}`,
        name: VIRTUAL_NAMES[i % VIRTUAL_NAMES.length],
        color: VIRTUAL_USER_COLORS[i % VIRTUAL_USER_COLORS.length],
        position: getRandomPosition(),
        isCurrentUser: false,
        zIndex: 50 - i, // Different z-indexes to prevent overlap
        role: VIRTUAL_ROLES[i % VIRTUAL_ROLES.length]
      });
    }
    
    setUsers(initialUsers);
  }, [virtualUsersCount, currentUserName, currentUserColor, currentUserRole]);
  
  // Update container dimensions when it changes
  useEffect(() => {
    const updateContainerRect = () => {
      if (containerRef?.current) {
        setContainerRect(containerRef.current.getBoundingClientRect());
      } else {
        // If no container ref is provided, use the document body
        setContainerRect({
          width: window.innerWidth,
          height: window.innerHeight,
          left: 0,
          top: 0,
          right: window.innerWidth,
          bottom: window.innerHeight,
          x: 0,
          y: 0,
          toJSON: () => ({})
        });
      }
    };
    
    updateContainerRect();
    window.addEventListener('resize', updateContainerRect);
    
    return () => {
      window.removeEventListener('resize', updateContainerRect);
    };
  }, [containerRef]);
  
  // Track real user's mouse movement
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setUsers(prevUsers => {
        return prevUsers.map(user => {
          if (user.isCurrentUser) {
            // Get mouse position relative to the container
            const x = containerRef?.current 
              ? event.clientX - (containerRect?.left || 0) 
              : event.clientX;
            const y = containerRef?.current 
              ? event.clientY - (containerRect?.top || 0) 
              : event.clientY;
            
            return { ...user, position: { x, y } };
          }
          return user;
        });
      });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [containerRect, containerRef]);
  
  // Animate virtual users with random movements
  useEffect(() => {
    const moveIntervals: NodeJS.Timeout[] = [];
    
    users.forEach(user => {
      if (!user.isCurrentUser) {
        const interval = setInterval(() => {
          setUsers(prevUsers => {
            return prevUsers.map(u => {
              if (u.id === user.id) {
                return {
                  ...u,
                  position: getRandomPosition(u.position, containerRect)
                };
              }
              return u;
            });
          });
        }, 2000 + Math.random() * 3000); // Random interval between 2-5 seconds
        
        moveIntervals.push(interval);
      }
    });
    
    return () => {
      moveIntervals.forEach(interval => clearInterval(interval));
    };
  }, [users, containerRect]);
  
  // Helper function to get random position
  function getRandomPosition(
    currentPos?: { x: number; y: number },
    rect?: DOMRect | null
  ): { x: number; y: number } {
    const maxX = (rect?.width || window.innerWidth) - 100;
    const maxY = (rect?.height || window.innerHeight) - 100;
    
    if (currentPos) {
      // Move within a reasonable distance from current position
      const maxDistance = 200;
      let newX = currentPos.x + (Math.random() - 0.5) * maxDistance;
      let newY = currentPos.y + (Math.random() - 0.5) * maxDistance;
      
      // Keep within bounds
      newX = Math.max(20, Math.min(newX, maxX));
      newY = Math.max(20, Math.min(newY, maxY));
      
      return { x: newX, y: newY };
    }
    
    // Initial random position
    return {
      x: 20 + Math.random() * maxX,
      y: 20 + Math.random() * maxY
    };
  }
  
  return (
    <>
      {users.map(user => (
        <MousePointer key={user.id} user={user} />
      ))}
    </>
  );
};

export default CollaborativePointers;
