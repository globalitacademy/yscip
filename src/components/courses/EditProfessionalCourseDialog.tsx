
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ProfessionalCourseForm from './ProfessionalCourseForm';
import { ProfessionalCourse } from './types/ProfessionalCourse';

interface EditProfessionalCourseDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedCourse: ProfessionalCourse | null;
  setSelectedCourse: React.Dispatch<React.SetStateAction<ProfessionalCourse | null>>;
  handleEditCourse: () => void;
}

const EditProfessionalCourseDialog: React.FC<EditProfessionalCourseDialogProps> = ({
  isOpen,
  setIsOpen,
  selectedCourse,
  setSelectedCourse,
  handleEditCourse
}) => {
  if (!selectedCourse) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Դասընթացի խմբագրում</DialogTitle>
          <DialogDescription>
            Փոփոխեք դասընթացի տվյալները ներքևում: Պատրաստ լինելուց հետո սեղմեք "Պահպանել" կոճակը:
          </DialogDescription>
        </DialogHeader>
        <ProfessionalCourseForm
          course={selectedCourse}
          setCourse={(newCourse) => setSelectedCourse(newCourse as ProfessionalCourse)}
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

export default EditProfessionalCourseDialog;
