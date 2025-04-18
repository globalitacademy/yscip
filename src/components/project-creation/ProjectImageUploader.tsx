import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from "@/components/ui/use-toast";
import { ImageIcon, X, Upload } from 'lucide-react';
import { Label } from '@/components/ui/label';

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
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Սխալ",
        description: "Նկարի չափը չպետք է գերազանցի 5 ՄԲ-ը",
        variant: "destructive",
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Սխալ",
        description: "Ֆայլը պետք է լինի նկար",
        variant: "destructive",
      });
      return;
    }

    setIsImageUploading(true);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      onImageChange(result);
      setIsImageUploading(false);
      
      toast({
        title: "Նկարը ավելացված է",
        description: "Նկարը հաջողությամբ ավելացվել է",
      });
    };
    
    reader.onerror = () => {
      setIsImageUploading(false);
      toast({
        title: "Սխալ",
        description: "Նկարի ավելացման ժամանակ առաջացել է սխալ",
        variant: "destructive",
      });
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <Label htmlFor="image">Պրոեկտի նկար</Label>
      <div 
        className={`mt-1 border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-accent/30 transition-colors ${dragActive ? 'border-primary bg-primary/5' : ''} ${previewImage ? 'border-primary' : 'border-muted-foreground/30'}`}
        onClick={handleImageClick}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />
        
        {previewImage ? (
          <div className="relative w-full">
            <img 
              src={previewImage} 
              alt="Project preview" 
              className="max-h-48 mx-auto rounded-md object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
                toast({
                  title: "Նկարը չի կարող ցուցադրվել",
                  description: "Նկարի URL-ը սխալ է կամ նկարը այլևս հասանելի չէ",
                  variant: "destructive",
                });
              }}
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                onImageRemove();
              }}
            >
              <X size={14} />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center py-4">
            {isImageUploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground">Նկարը բեռնվում է...</p>
              </div>
            ) : (
              <>
                {dragActive ? (
                  <Upload size={40} className="text-primary mb-2" />
                ) : (
                  <ImageIcon size={40} className="text-muted-foreground mb-2" />
                )}
                <p className="text-sm text-muted-foreground">Սեղմեք այստեղ նկար ավելացնելու համար</p>
                <p className="text-xs text-muted-foreground mt-1">կամ քաշեք նկարը այստեղ</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectImageUploader;
