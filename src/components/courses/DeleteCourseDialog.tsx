
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Course } from './types';
import { ProfessionalCourse } from './types/ProfessionalCourse';

interface DeleteCourseDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedCourse: Course | Partial<ProfessionalCourse> | null;
  onDelete: () => void;
}

const DeleteCourseDialog: React.FC<DeleteCourseDialogProps> = ({
  isOpen,
  setIsOpen,
  selectedCourse,
  onDelete
}) => {
  if (!selectedCourse) return null;

  const courseName = 'name' in selectedCourse ? selectedCourse.name : selectedCourse.title;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Դասընթացի ջնջում</DialogTitle>
          <DialogDescription>
            Դուք իսկապե՞ս ցանկանում եք ջնջել "{courseName}" դասընթացը։ Այս գործողությունը հետ դարձնել հնարավոր չէ։
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)} className="w-full sm:w-auto">Չեղարկել</Button>
          <Button 
            variant="destructive" 
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }} 
            className="w-full sm:w-auto"
          >
            Ջնջել
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCourseDialog;
