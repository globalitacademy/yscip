
import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import ImagePreview from './ImagePreview';

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
        "cursor-pointer hover:opacity-90 transition-opacity",
        disabled && "cursor-not-allowed opacity-70"
      )} 
      onClick={disabled ? undefined : onTriggerFileInput}
    >
      <ImagePreview 
        imgSrc={currentImage}
        placeholder={placeholder}
        previewHeight={previewHeight}
        rounded={rounded}
        disabled={disabled}
        isEditing={false}
      />
      
      {showEditButton && !disabled && (
        <Button 
          variant="secondary" 
          onClick={onTriggerFileInput}
          className="mt-2 w-full"
        >
          <Upload size={16} className="mr-2" />
          {currentImage ? 'Փոխել նկարը' : 'Ներբեռնել նկար'}
        </Button>
      )}
    </div>
  );
};

export default StandardModeControls;
