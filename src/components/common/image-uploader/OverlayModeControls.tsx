
import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { Check, X, Camera } from 'lucide-react';
import ImagePreview from './ImagePreview';

interface OverlayModeControlsProps {
  currentImage: string | null;
  previewUrl: string | null;
  placeholder: string;
  previewHeight: string;
  rounded: boolean;
  isEditing: boolean;
  isHovering: boolean;
  disabled: boolean;
  showEditButton: boolean;
  onTriggerFileInput: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const OverlayModeControls: React.FC<OverlayModeControlsProps> = ({
  currentImage,
  previewUrl,
  placeholder,
  previewHeight,
  rounded,
  isEditing,
  isHovering,
  disabled,
  showEditButton,
  onTriggerFileInput,
  onSave,
  onCancel
}) => {
  const displayImage = previewUrl || currentImage;
  
  return (
    <div 
      className="relative"
      onMouseEnter={() => {}}
      onMouseLeave={() => {}}
    >
      <ImagePreview 
        imgSrc={displayImage}
        placeholder={placeholder}
        previewHeight={previewHeight}
        rounded={rounded}
        disabled={disabled}
        isEditing={isEditing}
        showHoverControls={true}
        isHovering={isHovering}
        onTriggerFileInput={onTriggerFileInput}
      />
      
      {isEditing && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={onSave}
            className="bg-green-100 hover:bg-green-200 text-green-700"
          >
            <Check size={16} className="mr-1" />
            Պահպանել
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={onCancel}
            className="bg-red-100 hover:bg-red-200 text-red-700"
          >
            <X size={16} className="mr-1" />
            Չեղարկել
          </Button>
        </div>
      )}

      {!isEditing && !disabled && showEditButton && (
        <div className={cn(
          "absolute bottom-4 right-4 transition-opacity",
          isHovering ? "opacity-100" : "opacity-0"
        )}>
          <Button
            variant="secondary"
            onClick={onTriggerFileInput}
            size="sm"
            className="bg-white/90 hover:bg-white text-gray-800"
          >
            <Camera size={16} className="mr-1.5" />
            Փոխել նկարը
          </Button>
        </div>
      )}
    </div>
  );
};

export default OverlayModeControls;
