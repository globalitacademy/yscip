
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

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
      const result = await onSubmit();
      return result;
    } catch (error) {
      console.error("Error submitting form:", error);
      return false;
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
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Պահպանվում է...
          </>
        ) : submitText}
      </Button>
    </CardFooter>
  );
};

export default ProjectFormFooter;
