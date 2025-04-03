
import React from 'react';
import { cn } from '@/lib/utils';
import { useImageUploader } from './useImageUploader';
import StandardModeControls from './StandardModeControls';
import EditingModeControls from './EditingModeControls';
import OverlayModeControls from './OverlayModeControls';

interface ImageUploaderProps {
  currentImage?: string | null;
  onImageChange: (imageUrl: string) => void;
  className?: string;
  aspectRatio?: number;
  maxSize?: number; // in MB
  placeholder?: string;
  previewHeight?: string;
  rounded?: boolean;
  disabled?: boolean;
  showEditButton?: boolean;
  overlayMode?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImage,
  onImageChange,
  className,
  aspectRatio = 16/9,
  maxSize = 5, // 5MB
  placeholder = 'Սեղմեք նկար ներբեռնելու համար',
  previewHeight = 'h-64',
  rounded = false,
  disabled = false,
  showEditButton = true,
  overlayMode = false
}) => {
  const {
    isEditing,
    previewUrl,
    isHovering,
    fileInputRef,
    handleFileSelect,
    handleSave,
    handleCancel,
    triggerFileInput,
    handleMouseEnter,
    handleMouseLeave
  } = useImageUploader({
    currentImage,
    onImageChange,
    maxSize
  });

  // Overlay mode is used for banner-style images with editing controls
  if (overlayMode) {
    return (
      <div 
        className={cn("relative", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <OverlayModeControls
          currentImage={currentImage || null}
          previewUrl={previewUrl}
          placeholder={placeholder}
          previewHeight={previewHeight}
          rounded={rounded}
          isEditing={isEditing}
          isHovering={isHovering}
          disabled={disabled}
          showEditButton={showEditButton}
          onTriggerFileInput={triggerFileInput}
          onSave={handleSave}
          onCancel={handleCancel}
        />
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          className="hidden"
        />
      </div>
    );
  }

  // Standard mode with editor UI
  return (
    <div className={cn("space-y-4", className)}>
      {isEditing ? (
        <EditingModeControls
          previewUrl={previewUrl}
          currentImage={currentImage || null}
          placeholder={placeholder}
          previewHeight={previewHeight}
          rounded={rounded}
          onTriggerFileInput={triggerFileInput}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <StandardModeControls
          currentImage={currentImage || null}
          placeholder={placeholder}
          previewHeight={previewHeight}
          rounded={rounded}
          disabled={disabled}
          showEditButton={showEditButton}
          onTriggerFileInput={triggerFileInput}
        />
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};

export default ImageUploader;
