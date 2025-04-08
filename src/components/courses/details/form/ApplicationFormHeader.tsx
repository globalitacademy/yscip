
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ProfessionalCourse } from '../../types/ProfessionalCourse';
import { useTheme } from '@/hooks/use-theme';

interface ApplicationFormHeaderProps {
  course: ProfessionalCourse;
}

const ApplicationFormHeader: React.FC<ApplicationFormHeaderProps> = ({ course }) => {
  const { theme } = useTheme();
  
  return (
    <DialogHeader>
      <DialogTitle className={theme === 'dark' ? 'text-gray-100' : ''}>Դիմել դասընթացին</DialogTitle>
      <DialogDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
        {course.title} դասընթացին գրանցվելու համար լրացրեք հետևյալ ձևաթուղթը։
      </DialogDescription>
    </DialogHeader>
  );
};

export default ApplicationFormHeader;
