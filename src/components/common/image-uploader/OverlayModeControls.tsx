
import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { Edit, Save, X } from 'lucide-react';
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
  // Use the preview URL if available, otherwise use the current image
  const displayImage = previewUrl || currentImage;
  
  return (
    <div className="relative w-full">
      <ImagePreview 
        imgSrc={displayImage}
        placeholder={placeholder}
        previewHeight={previewHeight}
        rounded={rounded}
        disabled={disabled}
        isEditing={isEditing}
      />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30"></div>
      
      {/* Edit controls */}
      {isEditing ? (
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button 
            size="sm" 
            variant="default" 
            onClick={onSave}
            className="flex items-center gap-1"
          >
            <Save size={16} />
            Պահպանել
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={onCancel}
            className="bg-white/80 hover:bg-white/100 flex items-center gap-1"
          >
            <X size={16} />
            Չեղարկել
          </Button>
        </div>
      ) : (
        <>
          {(isHovering || showEditButton) && !disabled && (
            <div className="absolute top-4 right-4 transition-opacity duration-200">
              <Button 
                size="sm"
                variant="ghost" 
                onClick={onTriggerFileInput}
                className="bg-white/80 hover:bg-white/100 flex items-center gap-1"
              >
                <Edit size={16} />
                Փոխել նկարը
              </Button>
            </div>
          )}
        </>
      )}
      
      {isEditing && (
        <div className="absolute bottom-4 left-4">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={onTriggerFileInput}
            className="bg-white/80 hover:bg-white/100 flex items-center gap-1"
          >
            <Edit size={16} />
            Ընտրել այլ նկար
          </Button>
        </div>
      )}
    </div>
  );
};

export default OverlayModeControls;
