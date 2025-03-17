
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pencil, Trash, Image } from 'lucide-react';
import { toast } from 'sonner';
import { ProjectTheme } from '@/data/projectThemes';

interface ProjectImageEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: ProjectTheme | null;
  onImageChange: (url: string) => void;
  onImageDelete: () => void;
}

const ProjectImageEditor: React.FC<ProjectImageEditorProps> = ({
  open,
  onOpenChange,
  project,
  onImageChange,
  onImageDelete
}) => {
  const [imageUrl, setImageUrl] = React.useState('');
  const [previewUrl, setPreviewUrl] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('url');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Reset state when dialog opens with project data
  React.useEffect(() => {
    if (open && project) {
      setImageUrl(project.image || '');
      setPreviewUrl(project.image || '');
    }
  }, [open, project]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    setPreviewUrl(e.target.value);
  };

  const handleSave = () => {
    if (!imageUrl.trim()) {
      toast.error('Նկարի URL-ը դատարկ է');
      return;
    }
    onImageChange(imageUrl);
    onOpenChange(false);
  };

  const handleDelete = () => {
    onImageDelete();
    onOpenChange(false);
    toast.success('Նկարը հաջողությամբ ջնջվել է');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Նկարի չափը չպետք է գերազանցի 5 ՄԲ-ը');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImageUrl(result);
      setPreviewUrl(result);
    };
    reader.onerror = () => {
      toast.error('Նկարի բեռնման ժամանակ սխալ է տեղի ունեցել');
    };
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Նախագծի նկարի կառավարում</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url">URL-ով</TabsTrigger>
            <TabsTrigger value="upload">Բեռնել</TabsTrigger>
          </TabsList>
          
          <TabsContent value="url" className="mt-4">
            <div className="flex flex-col gap-4">
              <Input
                placeholder="Նկարի URL հասցեն"
                value={imageUrl}
                onChange={handleUrlChange}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="upload" className="mt-4">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-accent/30 transition-colors"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <Image className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Սեղմեք այստեղ նկար ընտրելու համար
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {previewUrl && (
          <div className="mt-2">
            <p className="text-sm font-medium mb-2">Նախադիտում</p>
            <div className="h-48 bg-gray-100 rounded-md overflow-hidden">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-full object-cover"
                onError={() => {
                  setPreviewUrl('https://via.placeholder.com/640x360?text=Սխալ+նկար');
                  toast.error('Նկարը չի կարող ցուցադրվել');
                }}
              />
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between gap-2 mt-4">
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            className="w-full sm:w-auto"
          >
            <Trash className="mr-2 h-4 w-4" />
            Ջնջել նկարը
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Չեղարկել
            </Button>
            <Button 
              onClick={handleSave}
              className="w-full sm:w-auto"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Պահպանել
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectImageEditor;
