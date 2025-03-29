
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';

interface ProjectFormFooterProps {
  onSubmit: () => Promise<boolean> | boolean;
  submitText?: string;
}

const ProjectFormFooter: React.FC<ProjectFormFooterProps> = ({ 
  onSubmit,
  submitText = "Պահպանել" 
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <CardFooter className="flex justify-end border-t p-4">
      <Button 
        onClick={handleSubmit} 
        disabled={isSubmitting}
        className="px-6"
      >
        {isSubmitting ? "Պահպանվում է..." : submitText}
      </Button>
    </CardFooter>
  );
};

export default ProjectFormFooter;
