
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Check, X } from 'lucide-react';
import ImagePreview from './ImagePreview';

interface EditingModeControlsProps {
  previewUrl: string | null;
  currentImage: string | null;
  placeholder: string;
  previewHeight: string;
  rounded: boolean;
  onTriggerFileInput: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditingModeControls: React.FC<EditingModeControlsProps> = ({
  previewUrl,
  currentImage,
  placeholder,
  previewHeight,
  rounded,
  onTriggerFileInput,
  onSave,
  onCancel
}) => {
  const displayImage = previewUrl || currentImage;
  
  return (
    <div className="space-y-4">
      <ImagePreview 
        imgSrc={displayImage}
        placeholder={placeholder}
        previewHeight={previewHeight}
        rounded={rounded}
        disabled={false}
        isEditing={true}
      />
      
      <div className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          onClick={onTriggerFileInput}
          size="sm"
        >
          <RotateCcw size={14} className="mr-1.5" />
          Ընտրել այլ նկար
        </Button>
        <Button 
          variant="outline" 
          onClick={onSave}
          size="sm"
          className="bg-green-100 hover:bg-green-200 text-green-700 border-green-200"
        >
          <Check size={14} className="mr-1.5" />
          Պահպանել
        </Button>
        <Button 
          variant="outline" 
          onClick={onCancel}
          size="sm"
          className="bg-red-100 hover:bg-red-200 text-red-700 border-red-200"
        >
          <X size={14} className="mr-1.5" />
          Չեղարկել
        </Button>
      </div>
    </div>
  );
};

export default EditingModeControls;
