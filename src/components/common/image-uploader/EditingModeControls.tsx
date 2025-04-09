
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ImageIcon, Save, X, Upload } from 'lucide-react';

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
  return (
    <div>
      <div className="mb-3">
        {previewUrl ? (
          <div className={cn(
            "relative",
            previewHeight,
            rounded && "rounded-full overflow-hidden"
          )}>
            <img 
              src={previewUrl} 
              alt="Preview"
              className={cn(
                "object-cover w-full h-full",
                rounded ? "rounded-full" : "rounded-lg"
              )}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="outline"
                className="gap-1.5 bg-background/80 hover:bg-background"
                onClick={onTriggerFileInput}
              >
                <Upload size={14} /> Ընտրել այլ նկար
              </Button>
            </div>
          </div>
        ) : (
          <div 
            className={cn(
              "flex flex-col items-center justify-center gap-3 cursor-pointer",
              "bg-muted/50 border-2 border-dashed border-primary/40",
              previewHeight,
              rounded ? "rounded-full" : "rounded-lg"
            )}
            onClick={onTriggerFileInput}
          >
            <ImageIcon className="w-8 h-8 text-muted-foreground/60" />
            <span className="text-sm text-muted-foreground text-center px-4">
              {placeholder}
            </span>
          </div>
        )}
      </div>
      
      <div className="flex gap-2 justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onCancel} 
          className="gap-1.5 text-destructive hover:text-destructive"
        >
          <X size={14} /> Չեղարկել
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          onClick={onSave}
          className="gap-1.5"
          disabled={!previewUrl || previewUrl === currentImage}
        >
          <Save size={14} /> Պահպանել
        </Button>
      </div>
    </div>
  );
};

export default EditingModeControls;
