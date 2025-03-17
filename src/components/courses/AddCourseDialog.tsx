
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import CourseForm from './CourseForm';
import { Course } from './types';

interface AddCourseDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  newCourse: Partial<Course>;
  setNewCourse: React.Dispatch<React.SetStateAction<Partial<Course>>>;
  newModule: string;
  setNewModule: React.Dispatch<React.SetStateAction<string>>;
  handleAddModule: () => void;
  handleRemoveModule: (index: number) => void;
  handleAddCourse: () => void;
}

const AddCourseDialog: React.FC<AddCourseDialogProps> = ({
  isOpen,
  setIsOpen,
  newCourse,
  setNewCourse,
  newModule,
  setNewModule,
  handleAddModule,
  handleRemoveModule,
  handleAddCourse
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Ավելացնել նոր կուրս</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Նոր կուրսի ավելացում</DialogTitle>
          <DialogDescription>
            Լրացրեք կուրսի տվյալները ներքևում: Պատրաստ լինելուց հետո սեղմեք "Ավելացնել" կոճակը:
          </DialogDescription>
        </DialogHeader>
        <CourseForm
          course={newCourse}
          setCourse={setNewCourse}
          newModule={newModule}
          setNewModule={setNewModule}
          handleAddModule={handleAddModule}
          handleRemoveModule={handleRemoveModule}
        />
        <DialogFooter>
          <Button type="submit" onClick={handleAddCourse}>
            Ավելացնել
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCourseDialog;
