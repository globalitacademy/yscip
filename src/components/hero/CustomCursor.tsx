
import React from 'react';

interface CustomCursorProps {
  mousePosition: { x: number; y: number };
  cursorVisible: boolean;
  color?: string;
  isStatic?: boolean;
}

const CustomCursor: React.FC<CustomCursorProps> = ({ 
  mousePosition, 
  cursorVisible,
  color = "primary",
  isStatic = false
}) => {
  // Determine background color based on the color prop
  const getBgColor = () => {
    switch (color) {
      case 'red':
        return 'bg-red-500';
      case 'blue':
        return 'bg-blue-500';
      case 'green':
        return 'bg-green-500';
      case 'purple':
        return 'bg-purple-500';
      case 'yellow':
        return 'bg-yellow-400';
      case 'primary':
      default:
        return 'bg-yellow-400'; // Default to yellow as shown in the image
    }
  };
  
  // Add animation classes for the cursor
  const animationClass = isStatic 
    ? '' 
    : 'transition-all ease-out duration-100';
  
  return (
    <div 
      className={`fixed ${getBgColor()} pointer-events-none z-50 ${animationClass} ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{
        left: `${mousePosition.x}px`,
        top: `${mousePosition.y}px`,
        transform: 'translate(-50%, -50%) rotate(45deg)',
        width: '20px',
        height: '20px',
        clipPath: 'polygon(0 0, 100% 0, 0 100%)',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))'
      }}
    />
  );
};

export default CustomCursor;
