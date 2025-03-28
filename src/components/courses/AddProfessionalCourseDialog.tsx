
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ProfessionalCourseForm from './ProfessionalCourseForm';
import { ProfessionalCourse } from './types/ProfessionalCourse';

interface AddProfessionalCourseDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  newCourse: Partial<ProfessionalCourse>;
  setNewCourse: React.Dispatch<React.SetStateAction<Partial<ProfessionalCourse>>>;
  handleAddCourse: (course: Omit<ProfessionalCourse, 'id' | 'createdAt'>) => Promise<boolean>;
}

const AddProfessionalCourseDialog: React.FC<AddProfessionalCourseDialogProps> = ({
  isOpen,
  setIsOpen,
  newCourse,
  setNewCourse,
  handleAddCourse
}) => {
  const handleSubmit = () => {
    if (newCourse) {
      // Cast to required type and call the handler
      handleAddCourse(newCourse as Omit<ProfessionalCourse, 'id' | 'createdAt'>);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Ավելացնել նոր դասընթաց</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Նոր դասընթացի ավելացում</DialogTitle>
          <DialogDescription>
            Լրացրեք դասընթացի տվյալները ներքևում: Պատրաստ լինելուց հետո սեղմեք "Ավելացնել" կոճակը:
          </DialogDescription>
        </DialogHeader>
        <ProfessionalCourseForm
          course={newCourse}
          setCourse={setNewCourse}
        />
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Ավելացնել
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProfessionalCourseDialog;
