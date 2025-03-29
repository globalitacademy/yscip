
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProjectFormFooterProps {
  onSubmit: () => Promise<boolean> | boolean;
  submitText?: string;
  isDisabled?: boolean;
}

const ProjectFormFooter: React.FC<ProjectFormFooterProps> = ({ 
  onSubmit,
  submitText = "Պահպանել",
  isDisabled = false
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const handleSubmit = async () => {
    if (isSubmitting) return false;
    
    setIsSubmitting(true);
    try {
      const result = await onSubmit();
      if (!result) {
        toast.error("Պահպանման սխալ տեղի ունեցավ:");
      }
      return result;
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(`Սխալ ֆորմի ուղարկման ժամանակ: ${error instanceof Error ? error.message : 'Անհայտ սխալ'}`);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <CardFooter className="flex justify-end border-t p-4">
      <Button 
        onClick={handleSubmit} 
        disabled={isSubmitting || isDisabled}
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
