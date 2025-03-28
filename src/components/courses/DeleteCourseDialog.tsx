
import React from 'react';
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
}

const DeleteCourseDialog: React.FC<DeleteCourseDialogProps> = ({
  isOpen,
  setIsOpen,
  selectedCourse,
  onDelete
}) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  if (!selectedCourse) return null;

  // Handle both naming conventions (name from old interface, title from new interface)
  const courseName = 'name' in selectedCourse && selectedCourse.name 
    ? selectedCourse.name 
    : 'title' in selectedCourse && selectedCourse.title 
      ? selectedCourse.title 
      : 'Անանուն դասընթաց';

  const handleDeleteClick = async () => {
    if (isDeleting) return; // Prevent multiple clicks
    
    try {
      setIsDeleting(true);
      console.log("DeleteCourseDialog: Starting delete for course:", selectedCourse.id);
      
      const success = await onDelete();
      console.log("DeleteCourseDialog: Delete result:", success);
      
      if (success) {
        toast.success('Դասընթացը հաջողությամբ ջնջվել է');
        setIsOpen(false);
      } else {
        toast.error('Դասընթացը ջնջելիս սխալ է տեղի ունեցել');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Դասընթացը ջնջելիս սխալ է տեղի ունեցել');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(value) => !isDeleting && setIsOpen(value)}>
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
            disabled={isDeleting}
          >
            Չեղարկել
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDeleteClick} 
            className="w-full sm:w-auto"
            disabled={isDeleting}
          >
            {isDeleting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Ջնջվում է...</> : 'Ջնջել'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCourseDialog;
