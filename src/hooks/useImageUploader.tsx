
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface UseImageUploaderProps {
  currentImage?: string | null;
  onImageChange: (imageUrl: string) => void;
  maxSize?: number; // in MB
}

export const useImageUploader = ({ 
  currentImage, 
  onImageChange, 
  maxSize = 5 
}: UseImageUploaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Update preview URL when currentImage changes
  useEffect(() => {
    setPreviewUrl(currentImage || null);
  }, [currentImage]);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxSize) {
      toast.error(`Ֆայլը չափազանց մեծ է։ Առավելագույն չափը ${maxSize}MB է։`);
      return;
    }
    
    // Create a preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setIsEditing(true);
  };
  
  const handleSave = () => {
    if (previewUrl && previewUrl !== currentImage) {
      // In a real app, you would upload the file to a server here
      // For now, we just pass the local URL
      onImageChange(previewUrl);
    }
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setPreviewUrl(currentImage || null);
    setIsEditing(false);
    
    // If we created an object URL, revoke it to avoid memory leaks
    if (previewUrl && previewUrl !== currentImage && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const handleMouseEnter = () => {
    setIsHovering(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  
  return {
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
  };
};
