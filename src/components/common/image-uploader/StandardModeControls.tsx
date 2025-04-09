
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ImageIcon, Edit } from 'lucide-react';

interface StandardModeControlsProps {
  currentImage: string | null;
  placeholder: string;
  previewHeight: string;
  rounded: boolean;
  disabled: boolean;
  showEditButton: boolean;
  onTriggerFileInput: () => void;
}

const StandardModeControls: React.FC<StandardModeControlsProps> = ({
  currentImage,
  placeholder,
  previewHeight,
  rounded,
  disabled,
  showEditButton,
  onTriggerFileInput
}) => {
  return (
    <div 
      className={cn(
        "relative cursor-pointer",
        disabled && "opacity-60 cursor-not-allowed"
      )}
      onClick={disabled ? undefined : onTriggerFileInput}
    >
      {currentImage ? (
        <div className={cn(
          "relative group",
          previewHeight,
          rounded && "rounded-full overflow-hidden"
        )}>
          <img 
            src={currentImage} 
            alt="Selected image"
            className={cn(
              "object-cover w-full h-full",
              rounded ? "rounded-full" : "rounded-lg"
            )}
          />
          
          {!disabled && showEditButton && (
            <div className={cn(
              "absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity",
              "flex items-center justify-center",
              rounded ? "rounded-full" : "rounded-lg"
            )}>
              <Button 
                variant="secondary" 
                size="sm"
                className="gap-1.5"
              >
                <Edit size={14} /> Խմբագրել
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className={cn(
          "flex flex-col items-center justify-center gap-3 bg-muted/50",
          "border-2 border-dashed border-muted-foreground/30",
          previewHeight,
          rounded ? "rounded-full" : "rounded-lg"
        )}>
          <ImageIcon className="w-8 h-8 text-muted-foreground/60" />
          <span className="text-sm text-muted-foreground text-center px-4">
            {placeholder}
          </span>
        </div>
      )}
    </div>
  );
};

export default StandardModeControls;
