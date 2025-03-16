
import React from 'react';
import { Button } from '@/components/ui/button';
import { ProjectTheme } from '@/data/projectThemes';
import { CheckCircle, XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProjectApproveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProject: ProjectTheme | null;
  onApprove: () => void;
}

const ProjectApproveDialog: React.FC<ProjectApproveDialogProps> = ({
  open,
  onOpenChange,
  selectedProject,
  onApprove
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Նախագծի հաստատում</DialogTitle>
          <DialogDescription>
            {selectedProject && `Հաստատել "${selectedProject.title}" նախագիծը։`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex gap-4 py-4 justify-end">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => onOpenChange(false)}
          >
            <XCircle size={16} />
            Չեղարկել
          </Button>
          
          <Button 
            className="flex items-center gap-2"
            onClick={onApprove}
          >
            <CheckCircle size={16} />
            Հաստատել
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectApproveDialog;
