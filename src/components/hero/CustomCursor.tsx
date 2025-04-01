
import React from 'react';

interface CustomCursorProps {
  mousePosition: { x: number; y: number };
  cursorVisible: boolean;
  color?: string;
  name?: string;
  direction?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  isStatic?: boolean;
}

const CustomCursor: React.FC<CustomCursorProps> = ({ 
  mousePosition, 
  cursorVisible,
  color = "primary",
  name = "",
  direction = "top-left",
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
      case 'primary':
      default:
        return 'bg-primary';
    }
  };

  // Determine pointer direction
  const getPointerStyle = () => {
    let rotateClass = "";
    let position = {};
    
    switch (direction) {
      case 'top-left':
        rotateClass = "rotate-45";
        position = { top: '-4px', left: '-4px' };
        break;
      case 'top-right':
        rotateClass = "rotate-[135deg]";
        position = { top: '-4px', right: '-4px' };
        break;
      case 'bottom-left':
        rotateClass = "rotate-[-45deg]";
        position = { bottom: '-4px', left: '-4px' };
        break;
      case 'bottom-right':
        rotateClass = "rotate-[-135deg]";
        position = { bottom: '-4px', right: '-4px' };
        break;
      default:
        rotateClass = "rotate-45";
        position = { top: '-4px', left: '-4px' };
    }
    
    return { rotateClass, position };
  };

  const { rotateClass, position } = getPointerStyle();

  // Add animation classes for the cursor
  const animationClass = isStatic 
    ? '' 
    : 'transition-all ease-out duration-150';
  
  // Add specific styling for the static cursors
  const staticStyles = isStatic 
    ? 'ring-2 ring-white/20' 
    : '';

  // Add shadow and opacity transitions
  const shadowStyle = 'shadow-lg shadow-black/10';
  
  return (
    <div 
      className={`fixed px-3 py-1.5 rounded-md ${getBgColor()} text-white font-medium text-sm min-w-[80px] text-center pointer-events-none z-50 ${animationClass} ${staticStyles} ${shadowStyle} ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{
        left: `${mousePosition.x}px`,
        top: `${mousePosition.y}px`,
        transform: 'translate(-50%, -50%)',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))'
      }}
    >
      {name}
      <div 
        className={`absolute w-3 h-3 ${getBgColor()} ${rotateClass}`}
        style={position}
      />
    </div>
  );
};

export default CustomCursor;
