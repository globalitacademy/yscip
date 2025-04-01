
import React from 'react';

interface CustomCursorProps {
  mousePosition: { x: number; y: number };
  cursorVisible: boolean;
  color?: string;
  tooltipText?: string;
  showTooltip?: boolean;
}

const CustomCursor: React.FC<CustomCursorProps> = ({ 
  mousePosition, 
  cursorVisible,
  color = "primary",
  tooltipText,
  showTooltip = false
}) => {
  // Determine background color based on the color prop
  const getBgColor = () => {
    switch (color) {
      case 'red':
        return 'bg-red-500/40';
      case 'blue':
        return 'bg-blue-500/40';
      case 'primary':
      default:
        return 'bg-primary/20';
    }
  };

  // Determine box shadow color based on the color prop
  const getShadowColor = () => {
    switch (color) {
      case 'red':
        return 'rgba(239, 68, 68, 0.4)'; // red-500 equivalent
      case 'blue':
        return 'rgba(59, 130, 246, 0.4)'; // blue-500 equivalent
      case 'primary':
      default:
        return 'rgba(var(--primary), 0.2)';
    }
  };

  return (
    <div className="relative">
      <div 
        className={`fixed min-w-[120px] h-10 rounded-full ${getBgColor()} mix-blend-plus-lighter pointer-events-none z-50 transition-opacity duration-300 backdrop-blur-sm flex items-center justify-center px-3 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: 'translate(-50%, -50%)',
          boxShadow: `0 0 20px 5px ${getShadowColor()}`
        }}
      >
        {showTooltip && tooltipText && (
          <span className="text-xs font-medium text-foreground whitespace-nowrap">
            {tooltipText}
          </span>
        )}
      </div>
    </div>
  );
};

export default CustomCursor;
