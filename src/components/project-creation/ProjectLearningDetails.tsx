
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PlusCircle, X } from 'lucide-react';

interface ProjectLearningDetailsProps {
  prerequisites: string[];
  onPrerequisitesChange: (prerequisites: string[]) => void;
  learningOutcomes: string[];
  onLearningOutcomesChange: (outcomes: string[]) => void;
}

const ProjectLearningDetails: React.FC<ProjectLearningDetailsProps> = ({
  prerequisites,
  onPrerequisitesChange,
  learningOutcomes,
  onLearningOutcomesChange
}) => {
  const [currentPrereq, setCurrentPrereq] = useState('');
  const [currentOutcome, setCurrentOutcome] = useState('');

  const handleAddPrereq = () => {
    if (currentPrereq.trim() && !prerequisites.includes(currentPrereq.trim())) {
      onPrerequisitesChange([...prerequisites, currentPrereq.trim()]);
      setCurrentPrereq('');
    }
  };

  const handleRemovePrereq = (prereq: string) => {
    onPrerequisitesChange(prerequisites.filter(p => p !== prereq));
  };

  const handleAddOutcome = () => {
    if (currentOutcome.trim() && !learningOutcomes.includes(currentOutcome.trim())) {
      onLearningOutcomesChange([...learningOutcomes, currentOutcome.trim()]);
      setCurrentOutcome('');
    }
  };

  const handleRemoveOutcome = (outcome: string) => {
    onLearningOutcomesChange(learningOutcomes.filter(o => o !== outcome));
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <Label htmlFor="prerequisites">Նախապայմաններ</Label>
        <div className="flex mt-1 gap-2">
          <Input
            id="prerequisites"
            value={currentPrereq}
            onChange={(e) => setCurrentPrereq(e.target.value)}
            placeholder="Օրինակ՝ JavaScript հիմունքներ"
            className="flex-grow"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPrereq())}
          />
          <Button type="button" onClick={handleAddPrereq} size="icon">
            <PlusCircle size={16} />
          </Button>
        </div>
        <div className="flex flex-col gap-2 mt-2">
          {prerequisites.map((prereq, index) => (
            <div key={index} className="flex items-center gap-2 group">
              <span className="text-sm flex-grow">{prereq}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemovePrereq(prereq)}
              >
                <X size={14} />
              </Button>
            </div>
          ))}
          {prerequisites.length === 0 && (
            <span className="text-sm text-muted-foreground">Դեռևս նախապայմաններ չկան։</span>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="learningOutcomes">Սովորելու արդյունքներ</Label>
        <div className="flex mt-1 gap-2">
          <Input
            id="learningOutcomes"
            value={currentOutcome}
            onChange={(e) => setCurrentOutcome(e.target.value)}
            placeholder="Ինչ կսովորի ուսանողը"
            className="flex-grow"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOutcome())}
          />
          <Button type="button" onClick={handleAddOutcome} size="icon">
            <PlusCircle size={16} />
          </Button>
        </div>
        <div className="flex flex-col gap-2 mt-2">
          {learningOutcomes.map((outcome, index) => (
            <div key={index} className="flex items-center gap-2 group">
              <span className="text-sm flex-grow">{outcome}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveOutcome(outcome)}
              >
                <X size={14} />
              </Button>
            </div>
          ))}
          {learningOutcomes.length === 0 && (
            <span className="text-sm text-muted-foreground">Դեռևս արդյունքներ չկան։</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectLearningDetails;
