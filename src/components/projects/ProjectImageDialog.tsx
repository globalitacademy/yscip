
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProjectTheme } from '@/data/projectThemes';

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Նախագծի նկարի փոփոխում</DialogTitle>
          <DialogDescription>
            Մուտքագրեք նոր նկարի URL-ը "{selectedProject?.title}" նախագծի համար։
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="image-url" className="text-sm font-medium">Նկարի URL</label>
            <Input
              id="image-url"
              placeholder="Օրինակ՝ https://example.com/image.jpg"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
            />
          </div>
          {newImageUrl && (
            <div className="mt-2">
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
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">Չեղարկել</Button>
          <Button onClick={onSave} className="w-full sm:w-auto">Պահպանել</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectImageDialog;
