
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
      console.log("Attempting to submit form...");
      const result = await onSubmit();
      console.log("Form submission result:", result);
      
      if (!result) {
        // Don't show error here, let the onSubmit function handle specific error messages
        console.log("Form submission unsuccessful");
      } else {
        // Only show success message here if onSubmit returns true
        toast.success("Հաջողությամբ պահպանվեց");
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
