
import React, { useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProjectImageUploaderProps {
  previewImage: string | null;
  onImageChange: (imageDataUrl: string) => void;
  onImageRemove: () => void;
}

const ProjectImageUploader: React.FC<ProjectImageUploaderProps> = ({ 
  previewImage, 
  onImageChange, 
  onImageRemove 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.includes('image')) {
      toast.error('Խնդրում ենք ընտրել նկար');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Նկարի չափը չպետք է գերազանցի 5MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      onImageChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };
  
  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    
    if (!file.type.includes('image')) {
      toast.error('Խնդրում ենք ընտրել նկար');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Նկարի չափը չպետք է գերազանցի 5MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      onImageChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <Label>Նախագծի նկար</Label>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*" 
        onChange={handleFileChange} 
        className="hidden" 
      />
      
      {previewImage ? (
        <div className="relative">
          <img 
            src={previewImage} 
            alt="Նախագծի նկար" 
            className="w-full h-40 object-cover rounded-lg border border-border"
          />
          <Button 
            variant="destructive" 
            size="icon" 
            className="absolute top-2 right-2"
            onClick={onImageRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDraggingOver ? 'border-primary bg-primary/10' : 'border-border'
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-1">
            Քաշեք և գցեք նկարը այստեղ կամ սեղմեք ընտրելու համար
          </p>
          <p className="text-xs text-muted-foreground">PNG, JPG (մինչև 5MB)</p>
        </div>
      )}
    </div>
  );
};

export default ProjectImageUploader;
