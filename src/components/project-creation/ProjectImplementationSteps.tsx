
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PlusCircle, X } from 'lucide-react';

interface ProjectImplementationStepsProps {
  steps: string[];
  onStepsChange: (steps: string[]) => void;
}

const ProjectImplementationSteps: React.FC<ProjectImplementationStepsProps> = ({
  steps,
  onStepsChange
}) => {
  const [currentStep, setCurrentStep] = useState('');

  const handleAddStep = () => {
    if (currentStep.trim()) {
      onStepsChange([...steps, currentStep.trim()]);
      setCurrentStep('');
    }
  };

  const handleRemoveStep = (index: number) => {
    onStepsChange(steps.filter((_, i) => i !== index));
  };

  return (
    <div>
      <Label htmlFor="steps">Իրականացման քայլեր</Label>
      <div className="flex mt-1 gap-2">
        <Textarea
          id="steps"
          value={currentStep}
          onChange={(e) => setCurrentStep(e.target.value)}
          placeholder="Նկարագրեք իրականացման քայլը"
          className="flex-grow resize-none"
          rows={2}
        />
        <Button type="button" onClick={handleAddStep} className="h-auto">
          <PlusCircle size={16} />
        </Button>
      </div>
      <div className="space-y-2 mt-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start gap-2 border border-input rounded-md p-2">
            <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
              {index + 1}
            </div>
            <p className="flex-grow text-sm">{step}</p>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
              onClick={() => handleRemoveStep(index)}
            >
              <X size={14} />
            </Button>
          </div>
        ))}
        {steps.length === 0 && (
          <span className="text-sm text-muted-foreground block p-2">Դեռևս քայլեր չկան։ Ավելացրեք իրականացման քայլերը։</span>
        )}
      </div>
    </div>
  );
};

export default ProjectImplementationSteps;
