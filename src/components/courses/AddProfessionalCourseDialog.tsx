
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ProfessionalCourseForm from './ProfessionalCourseForm';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AddProfessionalCourseDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  newCourse: Partial<ProfessionalCourse>;
  setNewCourse: React.Dispatch<React.SetStateAction<Partial<ProfessionalCourse>>>;
  handleAddCourse: () => void;
}

const AddProfessionalCourseDialog: React.FC<AddProfessionalCourseDialogProps> = ({
  isOpen,
  setIsOpen,
  newCourse,
  setNewCourse,
  handleAddCourse
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Ավելացնել նոր դասընթաց</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Նոր դասընթացի ավելացում</DialogTitle>
          <DialogDescription>
            Լրացրեք դասընթացի տվյալները ներքևում: Պատրաստ լինելուց հետո սեղմեք "Ավելացնել" կոճակը:
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <ProfessionalCourseForm
            course={newCourse}
            setCourse={setNewCourse}
          />
        </ScrollArea>
        <DialogFooter>
          <Button type="submit" onClick={handleAddCourse}>
            Ավելացնել
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProfessionalCourseDialog;
