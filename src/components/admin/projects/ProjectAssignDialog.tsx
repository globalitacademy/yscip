
import React from 'react';
import { Button } from '@/components/ui/button';
import { ProjectTheme } from '@/data/projectThemes';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface ProjectAssignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: ProjectTheme | null;
  onAssign: () => void;
}

const ProjectAssignDialog: React.FC<ProjectAssignDialogProps> = ({
  open,
  onOpenChange,
  project,
  onAssign
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Նախագծի նշանակում</DialogTitle>
          <DialogDescription>
            {project && `Նշանակել "${project.title}" նախագիծը ուսանողին կամ խմբին։`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Ընտրեք ուսանողին կամ խումբը" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student1">Գագիկ Պետրոսյան</SelectItem>
              <SelectItem value="student2">Արփինե Հովհաննիսյան</SelectItem>
              <SelectItem value="group1">Խումբ 913</SelectItem>
              <SelectItem value="group2">Խումբ 825</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Չեղարկել</Button>
          <Button onClick={onAssign}>Նշանակել</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectAssignDialog;
