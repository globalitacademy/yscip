
import React from 'react';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { MediaUploader } from './MediaUploader';

interface LogoSelectorProps {
  course: Partial<ProfessionalCourse>;
  setCourse: (course: Partial<ProfessionalCourse>) => void;
}

export const LogoSelector: React.FC<LogoSelectorProps> = ({ course, setCourse }) => {
  const handleMediaChange = (organizationLogo: string) => {
    setCourse({ ...course, organizationLogo });
  };

  return (
    <MediaUploader 
      mediaUrl={course.organizationLogo}
      onMediaChange={handleMediaChange}
      label="Կազմակերպության լոգո"
      uploadLabel="Ներբեռնել լոգո"
      placeholder="https://example.com/logo.jpg"
      previewHeight="max-h-20"
    />
  );
};
