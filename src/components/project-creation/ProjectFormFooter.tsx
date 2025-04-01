
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';

interface ProjectFormFooterProps {
  currentStep?: number;
  totalSteps?: number;
  onPreviousStep?: () => void;
  onNextStep?: () => void;
  isLastStep?: boolean;
  submitButtonText?: string;
  // Add support for direct form submission
  onSubmit?: () => void | Promise<boolean>;
  isDisabled?: boolean;
}

const ProjectFormFooter: React.FC<ProjectFormFooterProps> = ({
  currentStep,
  totalSteps,
  onPreviousStep,
  onNextStep,
  isLastStep,
  submitButtonText = "Ստեղծել նախագիծ",
  onSubmit,
  isDisabled = false
}) => {
  // If onSubmit is provided, use it directly; otherwise, render step navigation
  if (onSubmit) {
    return (
      <div className="flex justify-between items-center pt-6 border-t">
        <div className="text-sm text-muted-foreground">
          {currentStep && totalSteps ? `Քայլ ${currentStep} of ${totalSteps}` : ' '}
        </div>
        <div className="flex gap-2">
          <Button 
            type="button" 
            onClick={onSubmit}
            disabled={isDisabled}
          >
            <Save size={16} className="mr-2" />
            {submitButtonText}
          </Button>
        </div>
      </div>
    );
  }

  // Original step navigation rendering
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
            disabled={isDisabled}
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
