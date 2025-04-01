
import React from 'react';

interface CustomCursorProps {
  mousePosition: { x: number; y: number };
  cursorVisible: boolean;
  color?: string;
  name?: string;
  direction?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const CustomCursor: React.FC<CustomCursorProps> = ({ 
  mousePosition, 
  cursorVisible,
  color = "primary",
  name = "",
  direction = "top-left"
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
        position = { top: '-3px', left: '-3px' };
        break;
      case 'top-right':
        rotateClass = "rotate-[135deg]";
        position = { top: '-3px', right: '-3px' };
        break;
      case 'bottom-left':
        rotateClass = "rotate-[-45deg]";
        position = { bottom: '-3px', left: '-3px' };
        break;
      case 'bottom-right':
        rotateClass = "rotate-[-135deg]";
        position = { bottom: '-3px', right: '-3px' };
        break;
      default:
        rotateClass = "rotate-45";
        position = { top: '-3px', left: '-3px' };
    }
    
    return { rotateClass, position };
  };

  const { rotateClass, position } = getPointerStyle();

  return (
    <div 
      className={`fixed px-4 py-1.5 rounded-md ${getBgColor()} text-white font-medium text-sm min-w-[80px] text-center pointer-events-none z-50 transition-opacity duration-200 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{
        left: `${mousePosition.x}px`,
        top: `${mousePosition.y}px`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {name}
      <div 
        className={`absolute w-2 h-2 ${getBgColor()} ${rotateClass}`}
        style={position}
      />
    </div>
  );
};

export default CustomCursor;
