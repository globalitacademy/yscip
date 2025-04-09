
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ImageIcon, Save, X, Upload, Edit } from 'lucide-react';

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
  const imageUrl = previewUrl || currentImage;
  
  return (
    <>
      <div className={cn(
        "h-full w-full",
        rounded && "rounded-full overflow-hidden"
      )}>
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt="Selected"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-muted">
            <ImageIcon className="w-12 h-12 text-muted-foreground/40" />
          </div>
        )}
      </div>
      
      {isEditing && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
          <Button
            variant="outline"
            className="gap-1.5 bg-background/80 hover:bg-background mb-4"
            onClick={onTriggerFileInput}
          >
            <Upload size={16} /> Ընտրել նկար
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="bg-red-500/30 hover:bg-red-500/50 text-white border-red-500/50"
              onClick={onCancel}
            >
              <X size={16} className="mr-1" /> Չեղարկել
            </Button>
            <Button 
              variant="outline"
              className="bg-green-500/30 hover:bg-green-500/50 text-white border-green-500/50"
              onClick={onSave}
              disabled={!previewUrl}
            >
              <Save size={16} className="mr-1" /> Պահպանել
            </Button>
          </div>
        </div>
      )}
      
      {!isEditing && !disabled && showEditButton && isHovering && (
        <div className="absolute top-4 right-4">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 bg-background/80 hover:bg-background"
            onClick={onTriggerFileInput}
          >
            <Edit size={14} /> Խմբագրել նկարը
          </Button>
        </div>
      )}
    </>
  );
};

export default OverlayModeControls;
