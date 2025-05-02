
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ImageIcon, Save, X, Upload } from 'lucide-react';
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
  // Determine which image to show
  const imgSrc = previewUrl || currentImage;

  return (
    <>
      <ImagePreview 
        imgSrc={imgSrc}
        placeholder={placeholder}
        previewHeight={previewHeight}
        rounded={rounded}
        disabled={disabled}
        isEditing={isEditing}
      />
      
      {isEditing ? (
        <div className={cn(
          "absolute inset-0 flex items-center justify-center bg-black/50 z-10",
          rounded ? "rounded-full" : ""
        )}>
          <div className="flex flex-col items-center gap-4">
            <Button 
              onClick={onTriggerFileInput} 
              variant="outline"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <Upload className="w-4 h-4 mr-2" />
              Փոխել նկարը
            </Button>
            
            <div className="flex gap-2">
              <Button 
                onClick={onSave}
                variant="outline"
                className="bg-green-500/20 border-green-500/30 text-white hover:bg-green-500/30"
              >
                <Save className="w-4 h-4 mr-2" />
                Պահպանել
              </Button>
              
              <Button 
                onClick={onCancel}
                variant="outline"
                className="bg-red-500/20 border-red-500/30 text-white hover:bg-red-500/30"
              >
                <X className="w-4 h-4 mr-2" />
                Չեղարկել
              </Button>
            </div>
          </div>
        </div>
      ) : (
        isHovering && showEditButton && !disabled && (
          <div className={cn(
            "absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity",
            rounded ? "rounded-full" : ""
          )}>
            <Button 
              onClick={onTriggerFileInput}
              variant="outline"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Փոխել նկարը
            </Button>
          </div>
        )
      )}
    </>
  );
};

export default OverlayModeControls;
