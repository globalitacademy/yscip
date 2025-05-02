
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Upload, Save, X, ImageIcon } from 'lucide-react';
import ImagePreview from './ImagePreview';

interface EditingModeControlsProps {
  currentImage: string | null;
  previewUrl: string | null;
  placeholder: string;
  previewHeight: string;
  rounded: boolean;
  onTriggerFileInput: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditingModeControls: React.FC<EditingModeControlsProps> = ({
  currentImage,
  previewUrl,
  placeholder,
  previewHeight,
  rounded,
  onTriggerFileInput,
  onSave,
  onCancel
}) => {
  // Determine which image to show
  const imgSrc = previewUrl || currentImage;
  
  return (
    <div className="space-y-4">
      <ImagePreview
        imgSrc={imgSrc}
        placeholder={placeholder}
        previewHeight={previewHeight}
        rounded={rounded}
        disabled={false}
        isEditing={true}
      />
      
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={onTriggerFileInput}
          variant="outline"
          className="flex items-center gap-1.5"
        >
          <Upload size={16} />
          Փոխել նկարը
        </Button>
        
        <Button
          onClick={onSave}
          className="bg-green-600 hover:bg-green-700 text-white gap-1.5"
          disabled={!previewUrl}
        >
          <Save size={16} />
          Պահպանել
        </Button>
        
        <Button
          onClick={onCancel}
          variant="outline"
          className="border-destructive text-destructive hover:bg-destructive/10 gap-1.5"
        >
          <X size={16} />
          Չեղարկել
        </Button>
      </div>
    </div>
  );
};

export default EditingModeControls;
