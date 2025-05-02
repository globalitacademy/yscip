
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProjectTheme } from '@/data/projectThemes';
import { Upload, Link } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProjectImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProject: ProjectTheme | null;
  newImageUrl: string;
  setNewImageUrl: (url: string) => void;
  onSave: () => void;
}

const ProjectImageDialog: React.FC<ProjectImageDialogProps> = ({
  open,
  onOpenChange,
  selectedProject,
  newImageUrl,
  setNewImageUrl,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<string>("url");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Խնդրում ենք ներբեռնել միայն նկար։');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Նկարի չափը չպետք է գերազանցի 5MB-ը։');
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const dataUrl = event.target.result as string;
        setPreviewUrl(dataUrl);
        setNewImageUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Նախագծի նկարի փոփոխում</DialogTitle>
          <DialogDescription>
            Մուտքագրեք նոր նկարի URL-ը կամ ներբեռնեք նկար "{selectedProject?.title}" նախագծի համար։
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="url" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="url" className="flex items-center gap-2">
              <Link size={16} />
              URL
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload size={16} />
              Ներբեռնել
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="url" className="space-y-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="image-url" className="text-sm font-medium">Նկարի URL</label>
              <Input
                id="image-url"
                placeholder="Օրինակ՝ https://example.com/image.jpg"
                value={newImageUrl}
                onChange={(e) => {
                  setNewImageUrl(e.target.value);
                  setPreviewUrl(null);
                }}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Նկարի ներբեռնում</label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 cursor-pointer hover:bg-gray-50 transition-colors" onClick={handleClickUpload}>
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Սեղմեք նկար ներբեռնելու համար</p>
                <p className="text-xs text-gray-400 mt-1">Առավելագույնը 5MB</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Preview section - shown for both tabs if there's an image to preview */}
        {(newImageUrl || previewUrl) && (
          <div className="mt-2">
            <p className="text-sm font-medium mb-2">Նախադիտում</p>
            <div className="h-48 bg-gray-100 rounded-md overflow-hidden">
              <img 
                src={previewUrl || newImageUrl} 
                alt="Preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Handle image load error
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/640x360?text=Սխալ+նկար';
                }}
              />
            </div>
          </div>
        )}
        
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">Չեղարկել</Button>
          <Button onClick={onSave} disabled={!newImageUrl && !previewUrl} className="w-full sm:w-auto">Պահպանել</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectImageDialog;
