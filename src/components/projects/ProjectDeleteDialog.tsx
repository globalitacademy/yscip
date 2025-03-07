
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProjectTheme } from '@/data/projectThemes';

interface ProjectDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProject: ProjectTheme | null;
  onDelete: () => void;
}

const ProjectDeleteDialog: React.FC<ProjectDeleteDialogProps> = ({
  open,
  onOpenChange,
  selectedProject,
  onDelete
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Նախագծի հեռացում</DialogTitle>
          <DialogDescription>
            Դուք իսկապե՞ս ցանկանում եք հեռացնել "{selectedProject?.title}" նախագիծը։ 
            Այս գործողությունը չի կարող հետ շրջվել։
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">Չեղարկել</Button>
          <Button variant="destructive" onClick={onDelete} className="w-full sm:w-auto">Հեռացնել</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDeleteDialog;
