
import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle } from 'lucide-react';

interface CourseDeleteDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  handleDeleteCourse: () => Promise<void>;
  loading: boolean;
}

const CourseDeleteDialog: React.FC<CourseDeleteDialogProps> = ({
  isOpen,
  setIsOpen,
  handleDeleteCourse,
  loading
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ջնջել դասընթացը</DialogTitle>
          <DialogDescription>
            Դուք վստա՞հ եք, որ ցանկանում եք ջնջել այս դասընթացը։ Այս գործողությունը հնարավոր չէ հետ շրջել։
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
          <h3 className="text-amber-800 font-medium mb-1 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Զգուշացում
          </h3>
          <p className="text-amber-700 text-sm">
            Ջնջելով այս դասընթացը, դուք կջնջեք նաև բոլոր կապակցված տվյալները՝ դասերը, պահանջները և արդյունքները։
          </p>
        </div>
        
        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>Չեղարկել</Button>
          <Button variant="destructive" onClick={handleDeleteCourse} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Ջնջել
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CourseDeleteDialog;
