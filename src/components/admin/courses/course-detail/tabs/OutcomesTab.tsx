
import React from 'react';
import { OutcomesList } from '@/components/courses/form-components/OutcomesList';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';

interface OutcomesTabProps {
  editedCourse: Partial<ProfessionalCourse>;
  setEditedCourse: React.Dispatch<React.SetStateAction<Partial<ProfessionalCourse>>>;
}

export const OutcomesTab: React.FC<OutcomesTabProps> = ({ editedCourse, setEditedCourse }) => {
  const handleAddOutcome = (outcome: string) => {
    const outcomes = [...(editedCourse.outcomes || []), outcome];
    setEditedCourse({ ...editedCourse, outcomes });
  };

  const handleRemoveOutcome = (index: number) => {
    const outcomes = [...(editedCourse.outcomes || [])];
    outcomes.splice(index, 1);
    setEditedCourse({ ...editedCourse, outcomes });
  };

  return (
    <OutcomesList 
      outcomes={editedCourse.outcomes || []}
      onAddOutcome={handleAddOutcome}
      onRemoveOutcome={handleRemoveOutcome}
    />
  );
};
