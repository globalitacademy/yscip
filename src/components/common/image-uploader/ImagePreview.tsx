
import React from 'react';
import { cn } from "@/lib/utils";
import { Camera } from 'lucide-react';

interface ImagePreviewProps {
  imgSrc: string | null;
  placeholder: string;
  previewHeight: string;
  rounded: boolean;
  disabled: boolean;
  isEditing: boolean;
  showHoverControls?: boolean;
  isHovering?: boolean;
  onTriggerFileInput?: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  imgSrc,
  placeholder,
  previewHeight,
  rounded,
  disabled,
  isEditing,
  showHoverControls = false,
  isHovering = false,
  onTriggerFileInput
}) => {
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
      {!disabled && !isEditing && showHoverControls && (
        <div 
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-opacity",
            isHovering ? "opacity-100" : "opacity-0",
            "bg-black/40"
          )}
        >
          <button
            className="bg-white/90 hover:bg-white text-gray-800 px-3 py-1.5 rounded text-sm font-medium"
            onClick={onTriggerFileInput}
          >
            <Camera size={16} className="mr-2 inline-block" />
            Փոխել նկարը
          </button>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
