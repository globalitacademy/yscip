
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
  style = 'circle',
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
      case 'orange':
        return 'bg-orange-500';
      case 'pink':
        return 'bg-pink-500';
      case 'primary':
      default:
        return 'bg-primary'; // Now using primary color from theme
    }
  };
  
  // Determine cursor size
  const getCursorSize = () => {
    switch (size) {
      case 'small':
        return { width: '15px', height: '15px' };
      case 'large':
        return { width: '30px', height: '30px' };
      case 'medium':
      default:
        return { width: '22px', height: '22px' };
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
        return 'polygon(0 0, 100% 50%, 0 100%)';
    }
  };
  
  // Add animation classes for the cursor
  const animationClass = isStatic 
    ? '' 
    : 'transition-all ease-out duration-150';
  
  const { width, height } = getCursorSize();
  
  return (
    <>
      <div 
        className={`fixed ${getBgColor()} pointer-events-none z-50 ${animationClass} ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: 'translate(-50%, -50%)',
          width,
          height,
          clipPath: getClipPath(),
          filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))',
          mixBlendMode: 'multiply'
        }}
      />
      
      {label && cursorVisible && (
        <div 
          className="fixed pointer-events-none z-50 text-xs font-medium bg-background/90 text-foreground px-3 py-1.5 rounded-full shadow-md border border-border/40 backdrop-blur"
          style={{
            left: `${mousePosition.x + 16}px`,
            top: `${mousePosition.y + 16}px`,
            transform: 'translateY(-50%)',
            transition: isStatic ? 'none' : 'all 0.15s ease-out',
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
