
import React from 'react';

interface CustomCursorProps {
  mousePosition: { x: number; y: number };
  cursorVisible: boolean;
  color?: string;
  isStatic?: boolean;
  style?: 'triangle' | 'circle' | 'diamond' | 'square';
  size?: 'small' | 'medium' | 'large';
  label?: string;
}

const CustomCursor: React.FC<CustomCursorProps> = ({ 
  mousePosition, 
  cursorVisible,
  color = "primary",
  isStatic = false,
  style = 'triangle',
  size = 'medium',
  label
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
  
  // Determine cursor size
  const getCursorSize = () => {
    switch (size) {
      case 'small':
        return { width: '15px', height: '15px' };
      case 'large':
        return { width: '28px', height: '28px' };
      case 'medium':
      default:
        return { width: '20px', height: '20px' };
    }
  };
  
  // Determine cursor clip path based on style
  const getClipPath = () => {
    switch (style) {
      case 'circle':
        return 'circle(50% at 50% 50%)';
      case 'diamond':
        return 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
      case 'square':
        return 'none';
      case 'triangle':
      default:
        return 'polygon(0 0, 100% 0, 0 100%)';
    }
  };
  
  // Add animation classes for the cursor
  const animationClass = isStatic 
    ? '' 
    : 'transition-all ease-out duration-100';
  
  const { width, height } = getCursorSize();
  
  return (
    <>
      <div 
        className={`fixed ${getBgColor()} pointer-events-none z-50 ${animationClass} ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: 'translate(-50%, -50%) rotate(45deg)',
          width,
          height,
          clipPath: getClipPath(),
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
        }}
      />
      
      {label && cursorVisible && (
        <div 
          className="fixed pointer-events-none z-50 text-xs font-medium bg-background/80 text-foreground px-2 py-1 rounded-full shadow-sm border border-border/20 backdrop-blur-sm"
          style={{
            left: `${mousePosition.x + 12}px`,
            top: `${mousePosition.y + 12}px`,
            transform: 'translateY(-50%)',
            transition: isStatic ? 'none' : 'all 0.1s ease-out',
            opacity: cursorVisible ? 1 : 0
          }}
        >
          {label}
        </div>
      )}
    </>
  );
};

export default CustomCursor;
