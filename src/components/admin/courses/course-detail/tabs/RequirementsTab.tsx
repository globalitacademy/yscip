
import React from 'react';
import { RequirementsList } from '@/components/courses/form-components/RequirementsList';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';

interface RequirementsTabProps {
  editedCourse: Partial<ProfessionalCourse>;
  setEditedCourse: React.Dispatch<React.SetStateAction<Partial<ProfessionalCourse>>>;
}

export const RequirementsTab: React.FC<RequirementsTabProps> = ({ editedCourse, setEditedCourse }) => {
  const handleAddRequirement = (requirement: string) => {
    const requirements = [...(editedCourse.requirements || []), requirement];
    setEditedCourse({ ...editedCourse, requirements });
  };

  const handleRemoveRequirement = (index: number) => {
    const requirements = [...(editedCourse.requirements || [])];
    requirements.splice(index, 1);
    setEditedCourse({ ...editedCourse, requirements });
  };

  return (
    <RequirementsList 
      requirements={editedCourse.requirements || []}
      onAddRequirement={handleAddRequirement}
      onRemoveRequirement={handleRemoveRequirement}
    />
  );
};
