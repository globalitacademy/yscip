
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import CourseForm from './CourseForm';
import { Course } from './types';

interface EditCourseDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedCourse: Course | null;
  setSelectedCourse: React.Dispatch<React.SetStateAction<Course | null>>;
  newModule: string;
  setNewModule: React.Dispatch<React.SetStateAction<string>>;
  handleAddModuleToEdit: () => void;
  handleRemoveModuleFromEdit: (index: number) => void;
  handleEditCourse: () => void;
}

const EditCourseDialog: React.FC<EditCourseDialogProps> = ({
  isOpen,
  setIsOpen,
  selectedCourse,
  setSelectedCourse,
  newModule,
  setNewModule,
  handleAddModuleToEdit,
  handleRemoveModuleFromEdit,
  handleEditCourse
}) => {
  if (!selectedCourse) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Կուրսի խմբագրում</DialogTitle>
          <DialogDescription>
            Փոփոխեք կուրսի տվյալները ներքևում: Պատրաստ լինելուց հետո սեղմեք "Պահպանել" կոճակը:
          </DialogDescription>
        </DialogHeader>
        <CourseForm
          course={selectedCourse}
          setCourse={(newCourse) => setSelectedCourse(newCourse as Course)}
          newModule={newModule}
          setNewModule={setNewModule}
          handleAddModule={handleAddModuleToEdit}
          handleRemoveModule={handleRemoveModuleFromEdit}
          isEdit={true}
        />
        <DialogFooter>
          <Button type="submit" onClick={handleEditCourse}>
            Պահպանել
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCourseDialog;
