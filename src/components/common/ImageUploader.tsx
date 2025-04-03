
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, RotateCcw, Check, X, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

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
  const [isEditing, setIsEditing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`Նկարը չափազանց մեծ է: Առավելագույն չափը ${maxSize}MB է`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Միայն նկարներ են թույլատրվում');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewUrl(result);
    };
    reader.readAsDataURL(file);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (previewUrl) {
      onImageChange(previewUrl);
    }
    setIsEditing(false);
    setPreviewUrl(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPreviewUrl(null);
  };

  const triggerFileInput = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const renderPreview = () => {
    const imgSrc = previewUrl || currentImage;
    if (!imgSrc) {
      return (
        <div className={cn(
          "flex flex-col items-center justify-center bg-muted text-muted-foreground",
          previewHeight, 
          "w-full"
        )}>
          <Camera size={32} />
          <p className="mt-2 text-sm">{placeholder}</p>
        </div>
      );
    }

    return (
      <div 
        className={cn(
          "relative overflow-hidden",
          previewHeight,
          "w-full",
          rounded && "rounded-lg"
        )}
      >
        <img 
          src={imgSrc} 
          alt="Preview" 
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Նկարը+չի+գտնվել';
          }}
        />
        
        {/* Hover overlay */}
        {!disabled && !isEditing && showEditButton && (
          <div 
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-opacity",
              isHovering ? "opacity-100" : "opacity-0",
              "bg-black/40"
            )}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <Button
              variant="secondary"
              onClick={triggerFileInput}
              className="bg-white/90 hover:bg-white text-gray-800"
            >
              <Camera size={16} className="mr-2" />
              Փոխել նկարը
            </Button>
          </div>
        )}
      </div>
    );
  };

  // Overlay mode is used for banner-style images with editing controls
  if (overlayMode) {
    return (
      <div 
        className={cn("relative", className)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {renderPreview()}
        
        {isEditing && (
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleSave}
              className="bg-green-100 hover:bg-green-200 text-green-700"
            >
              <Check size={16} className="mr-1" />
              Պահպանել
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleCancel}
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
              onClick={triggerFileInput}
              size="sm"
              className="bg-white/90 hover:bg-white text-gray-800"
            >
              <Camera size={16} className="mr-1.5" />
              Փոխել նկարը
            </Button>
          </div>
        )}

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
        <div className="space-y-4">
          {renderPreview()}
          
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={triggerFileInput}
              size="sm"
            >
              <RotateCcw size={14} className="mr-1.5" />
              Ընտրել այլ նկար
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSave}
              size="sm"
              className="bg-green-100 hover:bg-green-200 text-green-700 border-green-200"
            >
              <Check size={14} className="mr-1.5" />
              Պահպանել
            </Button>
            <Button 
              variant="outline" 
              onClick={handleCancel}
              size="sm"
              className="bg-red-100 hover:bg-red-200 text-red-700 border-red-200"
            >
              <X size={14} className="mr-1.5" />
              Չեղարկել
            </Button>
          </div>
        </div>
      ) : (
        <div 
          className={cn(
            "cursor-pointer hover:opacity-90 transition-opacity",
            disabled && "cursor-not-allowed opacity-70"
          )} 
          onClick={disabled ? undefined : triggerFileInput}
        >
          {renderPreview()}
          
          {showEditButton && !disabled && (
            <Button 
              variant="secondary" 
              onClick={triggerFileInput}
              className="mt-2 w-full"
            >
              <Upload size={16} className="mr-2" />
              {currentImage ? 'Փոխել նկարը' : 'Ներբեռնել նկար'}
            </Button>
          )}
        </div>
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
