
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteCourse } from '../utils/courseDeleteUtils';
import { ProfessionalCourse } from '../types/ProfessionalCourse';

interface CourseDeleteDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  course: ProfessionalCourse | null;
  onSuccess: () => void;
}

const CourseDeleteDialog: React.FC<CourseDeleteDialogProps> = ({
  isOpen,
  setIsOpen,
  course,
  onSuccess
}) => {
  const confirmDeleteCourse = async () => {
    if (!course) return;
    
    await deleteCourse(course, onSuccess);
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Համոզվա՞ծ եք, որ ցանկանում եք ջնջել դասընթացը</AlertDialogTitle>
          <AlertDialogDescription>
            Այս գործողությունը անդառնալի է։ Դասընթացը կջնջվի համակարգից և այլևս հասանելի չի լինի։
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Չեղարկել</AlertDialogCancel>
          <AlertDialogAction onClick={confirmDeleteCourse} className="bg-red-500 hover:bg-red-600">
            Ջնջել
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CourseDeleteDialog;
