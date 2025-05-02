
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Edit, ImageIcon } from 'lucide-react';
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
    <div className="relative w-full">
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
          onClick={onTriggerFileInput}
          variant="outline"
          size="sm"
          className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-white/70 hover:bg-white"
          disabled={disabled}
        >
          <Edit size={14} />
          Փոխել նկարը
        </Button>
      )}
    </div>
  );
};

export default StandardModeControls;
