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

  // Add animation for the main cursor, keep static for others
  const animationClass = isStatic ? '' : 'transition-transform duration-100';
  
  // Add specific styling for the static cursors
  const staticStyles = isStatic 
    ? 'ring-2 ring-white ring-opacity-20' 
    : '';

  return (
    <div 
      className={`fixed px-3 py-1.5 rounded-md ${getBgColor()} text-white font-medium text-sm min-w-[80px] text-center pointer-events-none z-50 ${animationClass} ${staticStyles} ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{
        left: `${mousePosition.x}px`,
        top: `${mousePosition.y}px`,
        transform: 'translate(-50%, -50%)',
        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
      }}
    >
      {name}
      <div 
        className={`absolute w-2 h-2 ${getBgColor()} ${rotateClass} transform rotate-45`}
        style={position}
      />
    </div>
  );
};

export default CustomCursor;
