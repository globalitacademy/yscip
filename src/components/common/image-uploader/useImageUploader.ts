
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface UseImageUploaderProps {
  currentImage?: string | null;
  onImageChange: (imageUrl: string) => void;
  maxSize?: number;
}

export const useImageUploader = ({
  currentImage,
  onImageChange,
  maxSize = 5
}: UseImageUploaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset preview URL when current image changes
  useEffect(() => {
    if (!isEditing) {
      setPreviewUrl(null);
    }
  }, [currentImage, isEditing]);

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
      try {
        onImageChange(previewUrl);
        toast.success('Նկարը հաջողությամբ պահպանվել է');
      } catch (error) {
        console.error('Error saving image:', error);
        toast.error('Նկարի պահպանման ժամանակ սխալ է տեղի ունեցել');
      }
    }
    setIsEditing(false);
    setPreviewUrl(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPreviewUrl(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

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
