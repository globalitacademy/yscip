
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProjectTheme } from '@/data/projectThemes';

interface ProjectEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProject: ProjectTheme | null;
  editedProject: Partial<ProjectTheme>;
  setEditedProject: (project: Partial<ProjectTheme>) => void;
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
            <Label htmlFor="project-title">Վերնագիր</Label>
            <Input
              id="project-title"
              placeholder="Նախագծի վերնագիր"
              value={editedProject.title || ''}
              onChange={(e) => setEditedProject({...editedProject, title: e.target.value})}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="project-category">Կատեգորիա</Label>
            <Input
              id="project-category"
              placeholder="Նախագծի կատեգորիա"
              value={editedProject.category || ''}
              onChange={(e) => setEditedProject({...editedProject, category: e.target.value})}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="project-description">Նկարագրություն</Label>
            <Textarea
              id="project-description"
              placeholder="Նախագծի նկարագրություն"
              value={editedProject.description || ''}
              onChange={(e) => setEditedProject({...editedProject, description: e.target.value})}
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
