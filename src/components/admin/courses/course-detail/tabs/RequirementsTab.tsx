
import React, { useState } from 'react';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';

interface RequirementsTabProps {
  editedCourse: Partial<ProfessionalCourse>;
  setEditedCourse: (changes: Partial<ProfessionalCourse>) => void;
}

export const RequirementsTab: React.FC<RequirementsTabProps> = ({ editedCourse, setEditedCourse }) => {
  const [newRequirement, setNewRequirement] = useState('');
  
  const handleAddRequirement = () => {
    if (!newRequirement.trim()) {
      return;
    }
    
    // Use a callback to ensure we're working with the latest state
    setEditedCourse(prevState => {
      const currentRequirements = [...(prevState.requirements || [])];
      const updatedRequirements = [...currentRequirements, newRequirement.trim()];
      console.log('RequirementsTab: Adding requirement, updated requirements:', updatedRequirements);
      return { ...prevState, requirements: updatedRequirements };
    });
    
    setNewRequirement('');
  };
  
  const handleRemoveRequirement = (index: number) => {
    setEditedCourse(prevState => {
      const currentRequirements = [...(prevState.requirements || [])];
      currentRequirements.splice(index, 1);
      console.log('RequirementsTab: Removing requirement, updated requirements:', currentRequirements);
      return { ...prevState, requirements: currentRequirements };
    });
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newRequirement.trim()) {
      e.preventDefault();
      handleAddRequirement();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {(editedCourse.requirements || []).map((requirement, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="flex-grow p-2 bg-muted rounded">{requirement}</div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveRequirement(index)}
              title="Հեռացնել"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
      
      <div className="flex space-x-2">
        <Input
          value={newRequirement}
          onChange={(e) => setNewRequirement(e.target.value)}
          placeholder="Նոր պահանջ"
          onKeyDown={handleKeyDown}
        />
        <Button 
          onClick={handleAddRequirement} 
          disabled={!newRequirement.trim()}
        >
          Ավելացնել
        </Button>
      </div>
    </div>
  );
};
