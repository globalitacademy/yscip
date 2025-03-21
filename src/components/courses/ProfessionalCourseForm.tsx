
import React from 'react';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import BasicInfoSection from './form/BasicInfoSection';
import FormatLanguageSection from './form/FormatLanguageSection';
import InstitutionSection from './form/InstitutionSection';
import MediaSection from './form/MediaSection';
import ContentSection from './form/ContentSection';

interface ProfessionalCourseFormProps {
  course: Partial<ProfessionalCourse>;
  setCourse: (course: Partial<ProfessionalCourse>) => void;
  isEdit?: boolean;
}

const ProfessionalCourseForm: React.FC<ProfessionalCourseFormProps> = ({
  course,
  setCourse,
  isEdit = false
}) => {
  return (
    <div className="space-y-6 py-4">
      <div className="space-y-6">
        <BasicInfoSection course={course} setCourse={setCourse} />
        
        <FormatLanguageSection course={course} setCourse={setCourse} />
        
        <InstitutionSection course={course} setCourse={setCourse} />
        
        <MediaSection course={course} setCourse={setCourse} isEdit={isEdit} />
        
        <ContentSection course={course} setCourse={setCourse} />
      </div>
    </div>
  );
};

export default ProfessionalCourseForm;
