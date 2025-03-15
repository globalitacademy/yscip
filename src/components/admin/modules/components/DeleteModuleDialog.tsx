
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { EducationalModule } from '@/components/educationalCycle';

interface DeleteModuleDialogProps {
  open: boolean;
  selectedModule: EducationalModule | null;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
}

const DeleteModuleDialog: React.FC<DeleteModuleDialogProps> = ({
  open,
  selectedModule,
  onOpenChange,
  onDelete
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Հեռացնել մոդուլը</DialogTitle>
          <DialogDescription>
            Դուք իսկապե՞ս ցանկանում եք հեռացնել "{selectedModule?.title}" մոդուլը։ Այս գործողությունը անդառնալի է։
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Չեղարկել</Button>
          <Button variant="destructive" onClick={onDelete}>Հեռացնել</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModuleDialog;
