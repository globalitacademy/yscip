
import React, { useState } from 'react';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';

interface OutcomesTabProps {
  editedCourse: Partial<ProfessionalCourse>;
  setEditedCourse: (changes: Partial<ProfessionalCourse>) => void;
}

export const OutcomesTab: React.FC<OutcomesTabProps> = ({ editedCourse, setEditedCourse }) => {
  const [newOutcome, setNewOutcome] = useState('');
  
  const handleAddOutcome = () => {
    if (!newOutcome.trim()) {
      return;
    }
    
    // Use a callback to ensure we're working with the latest state
    setEditedCourse(prevState => {
      const currentOutcomes = [...(prevState.outcomes || [])];
      const updatedOutcomes = [...currentOutcomes, newOutcome.trim()];
      console.log('OutcomesTab: Adding outcome, updated outcomes:', updatedOutcomes);
      return { ...prevState, outcomes: updatedOutcomes };
    });
    
    setNewOutcome('');
  };
  
  const handleRemoveOutcome = (index: number) => {
    setEditedCourse(prevState => {
      const currentOutcomes = [...(prevState.outcomes || [])];
      currentOutcomes.splice(index, 1);
      console.log('OutcomesTab: Removing outcome, updated outcomes:', currentOutcomes);
      return { ...prevState, outcomes: currentOutcomes };
    });
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newOutcome.trim()) {
      e.preventDefault();
      handleAddOutcome();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {(editedCourse.outcomes || []).map((outcome, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="flex-grow p-2 bg-muted rounded">{outcome}</div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveOutcome(index)}
              title="Հեռացնել"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
      
      <div className="flex space-x-2">
        <Input
          value={newOutcome}
          onChange={(e) => setNewOutcome(e.target.value)}
          placeholder="Նոր արդյունք"
          onKeyDown={handleKeyDown}
        />
        <Button 
          onClick={handleAddOutcome} 
          disabled={!newOutcome.trim()}
        >
          Ավելացնել
        </Button>
      </div>
    </div>
  );
};
