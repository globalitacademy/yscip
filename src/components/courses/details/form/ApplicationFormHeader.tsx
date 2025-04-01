
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ProfessionalCourse } from '../../types/ProfessionalCourse';

interface ApplicationFormHeaderProps {
  course: ProfessionalCourse;
}

const ApplicationFormHeader: React.FC<ApplicationFormHeaderProps> = ({ course }) => {
  return (
    <DialogHeader>
      <DialogTitle>Դիմել դասընթացին</DialogTitle>
      <DialogDescription>
        {course.title} դասընթացին գրանցվելու համար լրացրեք հետևյալ ձևաթուղթը։
      </DialogDescription>
    </DialogHeader>
  );
};

export default ApplicationFormHeader;
