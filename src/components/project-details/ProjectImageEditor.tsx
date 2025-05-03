
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Link, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface ProjectImageEditorProps {
  currentImage: string | null;
  onSave: (imageUrl: string) => Promise<void>;
}

const ProjectImageEditor: React.FC<ProjectImageEditorProps> = ({ currentImage, onSave }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState(currentImage || '');
  const [activeTab, setActiveTab] = useState<'url' | 'upload'>('url');
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleOpenDialog = () => {
    setNewImageUrl(currentImage || '');
    setPreviewUrl(null);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!newImageUrl && !previewUrl) {
      toast.error('Խնդրում ենք ընտրել նկար կամ մուտքագրել URL հասցե');
      return;
    }

    setIsLoading(true);
    try {
      await onSave(previewUrl || newImageUrl);
      toast.success('Նախագծի նկարը հաջողությամբ թարմացվել է');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving image:', error);
      toast.error('Նկարի պահպանման ժամանակ սխալ է տեղի ունեցել');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type and size
    if (!file.type.startsWith('image/')) {
      toast.error('Խնդրում ենք ներբեռնել միայն նկար');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error('Նկարի չափը չպետք է գերազանցի 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPreviewUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <Button 
        variant="outline" 
        onClick={handleOpenDialog} 
        className="mt-4 w-full flex items-center justify-center gap-2"
      >
        <Upload size={16} />
        Փոխել նախագծի նկարը
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Նախագծի նկարի փոփոխում</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="url" value={activeTab} onValueChange={(value) => setActiveTab(value as 'url' | 'upload')}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="url" className="flex items-center gap-1">
                <Link size={14} /> URL
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-1">
                <Upload size={14} /> Ներբեռնել
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-4 mt-4">
              <div>
                <label htmlFor="image-url" className="text-sm font-medium">Նկարի հասցե</label>
                <Input
                  id="image-url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1"
                />
              </div>
              
              {newImageUrl && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Նախադիտում</p>
                  <div className="border rounded-md overflow-hidden h-48">
                    <img 
                      src={newImageUrl} 
                      alt="Նախադիտում" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback if image fails to load
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Սխալ+նկար';
                      }}
                    />
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="upload" className="space-y-4 mt-4">
              <div>
                <div 
                  className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p>Սեղմեք կամ քաշեք նկարը այստեղ</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG կամ GIF (մաքս. 5MB)</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>

              {previewUrl && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Նախադիտում</p>
                  <div className="border rounded-md overflow-hidden h-48">
                    <img 
                      src={previewUrl} 
                      alt="Նախադիտում" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              <X size={16} className="mr-2" /> Չեղարկել
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Պահպանվում է...' : (
                <><Save size={16} className="mr-2" /> Պահպանել</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectImageEditor;
