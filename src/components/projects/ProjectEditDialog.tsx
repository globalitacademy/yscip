
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProjectTheme } from '@/data/projectThemes';

interface ProjectEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProject: ProjectTheme | null;
  editedProject: Partial<ProjectTheme>;
  setEditedProject: (editedProject: Partial<ProjectTheme>) => void;
  onSave: () => void;
}

const ProjectEditDialog: React.FC<ProjectEditDialogProps> = ({
  open,
  onOpenChange,
  selectedProject,
  editedProject,
  setEditedProject,
  onSave
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Նախագծի խմբագրում</DialogTitle>
          <DialogDescription>
            Խմբագրեք "{selectedProject?.title}" նախագծի տվյալները։
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-sm font-medium">Վերնագիր</label>
            <Input
              id="title"
              value={editedProject.title || ''}
              onChange={(e) => setEditedProject({ ...editedProject, title: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-sm font-medium">Կատեգորիա</label>
            <Input
              id="category"
              value={editedProject.category || ''}
              onChange={(e) => setEditedProject({ ...editedProject, category: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-sm font-medium">Նկարագրություն</label>
            <Textarea
              id="description"
              value={editedProject.description || ''}
              onChange={(e) => setEditedProject({ ...editedProject, description: e.target.value })}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">Չեղարկել</Button>
          <Button onClick={onSave} className="w-full sm:w-auto">Պահպանել</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectEditDialog;
