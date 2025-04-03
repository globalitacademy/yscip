
import React from 'react';
import { cn } from "@/lib/utils";

interface ImagePreviewProps {
  imgSrc: string | null;
  placeholder: string;
  previewHeight: string;
  rounded: boolean;
  disabled: boolean;
  isEditing: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  imgSrc,
  placeholder,
  previewHeight,
  rounded,
  disabled,
  isEditing
}) => {
  return (
    <div
      className={cn(
        "overflow-hidden bg-muted relative",
        previewHeight,
        rounded ? "rounded-full aspect-square" : "rounded-md",
        isEditing ? "ring-2 ring-primary ring-offset-2" : "",
        disabled ? "opacity-50" : ""
      )}
    >
      {imgSrc ? (
        <img
          src={imgSrc}
          alt="Uploaded image"
          className={cn(
            "w-full h-full object-cover transition-all",
            rounded ? "" : "object-center"
          )}
          onError={(e) => {
            // Handle image load error
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/640x360?text=Սխալ+նկար';
          }}
        />
      ) : (
        <div className="flex items-center justify-center h-full w-full bg-gray-100 text-gray-400">
          {placeholder}
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
