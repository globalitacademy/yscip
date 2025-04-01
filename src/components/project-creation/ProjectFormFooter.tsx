
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';

interface ProjectFormFooterProps {
  currentStep: number;
  totalSteps: number;
  onPreviousStep: () => void;
  onNextStep: () => void;
  isLastStep: boolean;
  submitButtonText?: string;
}

const ProjectFormFooter: React.FC<ProjectFormFooterProps> = ({
  currentStep,
  totalSteps,
  onPreviousStep,
  onNextStep,
  isLastStep,
  submitButtonText = "Ստեղծել նախագիծ"
}) => {
  return (
    <div className="flex justify-between items-center pt-6 border-t">
      <div className="text-sm text-muted-foreground">
        Քայլ {currentStep} of {totalSteps}
      </div>
      <div className="flex gap-2">
        {currentStep > 1 && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onPreviousStep}
          >
            <ChevronLeft size={16} className="mr-2" />
            Նախորդ
          </Button>
        )}
        
        {!isLastStep ? (
          <Button 
            type="button" 
            onClick={onNextStep}
          >
            Հաջորդ
            <ChevronRight size={16} className="ml-2" />
          </Button>
        ) : (
          <Button 
            type="submit"
          >
            <Save size={16} className="mr-2" />
            {submitButtonText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProjectFormFooter;
