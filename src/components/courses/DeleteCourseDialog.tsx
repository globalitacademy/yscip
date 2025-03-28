
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Course } from './types';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface DeleteCourseDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedCourse: Course | Partial<ProfessionalCourse> | null;
  onDelete: () => Promise<boolean>;
  isDeleting?: boolean;
}

const DeleteCourseDialog: React.FC<DeleteCourseDialogProps> = ({
  isOpen,
  setIsOpen,
  selectedCourse,
  onDelete,
  isDeleting = false
}) => {
  const [localDeleting, setLocalDeleting] = useState(false);
  const isProcessing = isDeleting || localDeleting;

  if (!selectedCourse) return null;

  // Get course name, handling both naming conventions
  const courseName = 'name' in selectedCourse && selectedCourse.name 
    ? selectedCourse.name 
    : 'title' in selectedCourse && selectedCourse.title 
      ? selectedCourse.title 
      : 'Անանուն դասընթաց';

  const handleDeleteClick = async () => {
    if (isProcessing) return; // Prevent multiple clicks
    
    try {
      setLocalDeleting(true);
      console.log("DeleteCourseDialog: Attempting to delete course:", selectedCourse.id);
      
      const success = await onDelete();
      console.log("DeleteCourseDialog: Delete result:", success);
      
      if (success) {
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error in handleDeleteClick:', error);
      toast.error('Դասընթացը ջնջելիս սխալ է տեղի ունեցել');
    } finally {
      setLocalDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(value) => !isProcessing && setIsOpen(value)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Դասընթացի ջնջում</DialogTitle>
          <DialogDescription>
            Դուք իսկապե՞ս ցանկանում եք ջնջել "{courseName}" դասընթացը։ Այս գործողությունը հետ դարձնել հնարավոր չէ։
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)} 
            className="w-full sm:w-auto"
            disabled={isProcessing}
          >
            Չեղարկել
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDeleteClick} 
            className="w-full sm:w-auto"
            disabled={isProcessing}
          >
            {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Ջնջվում է...</> : 'Ջնջել'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCourseDialog;
