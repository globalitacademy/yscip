
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProjectTheme } from '@/data/projectThemes';
import { ImageIcon, Upload } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<"url" | "upload">("url");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewImageUrl(e.target.value);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // File size validation (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Ֆայլը չափազանց մեծ է: Առավելագույն չափը 5MB է");
      return;
    }
    
    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setNewImageUrl(event.target.result.toString());
      }
      setIsUploading(false);
    };
    
    reader.onerror = () => {
      setIsUploading(false);
      alert("Ֆայլի ներբեռնման ժամանակ առաջացավ սխալ");
    };
    
    reader.readAsDataURL(file);
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Նախագծի նկարի փոփոխում</DialogTitle>
          <DialogDescription>
            Ընտրեք նոր նկար "{selectedProject?.title}" նախագծի համար։
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="url" value={activeTab} onValueChange={(value) => setActiveTab(value as "url" | "upload")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url">URL հասցեով</TabsTrigger>
            <TabsTrigger value="upload">Ֆայլի ներբեռնում</TabsTrigger>
          </TabsList>
          
          <TabsContent value="url" className="pt-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="image-url" className="text-sm font-medium">Նկարի URL</label>
              <Input
                id="image-url"
                placeholder="Օրինակ՝ https://example.com/image.jpg"
                value={newImageUrl}
                onChange={handleUrlChange}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="upload" className="pt-4">
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Նկարը բեռնվում է...</p>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={triggerFileInput}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Ընտրել նկարը
                </Button>
              )}
              
              <p className="mt-2 text-xs text-muted-foreground">
                Ֆայլի առավելագույն չափը 5MB
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {newImageUrl && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Նախադիտում</p>
            <div className="h-48 bg-gray-100 rounded-md overflow-hidden">
              <img 
                src={newImageUrl} 
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
          <Button 
            onClick={onSave} 
            className="w-full sm:w-auto"
            disabled={!newImageUrl || isUploading}
          >
            Պահպանել
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectImageDialog;
