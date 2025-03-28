
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ProfessionalCourseForm from './ProfessionalCourseForm';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface AddProfessionalCourseDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  newCourse: Partial<ProfessionalCourse>;
  setNewCourse: React.Dispatch<React.SetStateAction<Partial<ProfessionalCourse>>>;
  handleAddCourse: (course: Omit<ProfessionalCourse, 'id' | 'createdAt'>) => Promise<boolean>;
}

const AddProfessionalCourseDialog: React.FC<AddProfessionalCourseDialogProps> = ({
  isOpen,
  setIsOpen,
  newCourse,
  setNewCourse,
  handleAddCourse
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newCourse.title || !newCourse.duration) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Generate slug if not provided
      if (!newCourse.slug && newCourse.title) {
        newCourse.slug = newCourse.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/--+/g, '-')
          .trim();
      }
      
      // Cast to required type and call the handler
      const success = await handleAddCourse(newCourse as Omit<ProfessionalCourse, 'id' | 'createdAt'>);
      
      if (success) {
        toast.success('Դասընթացը հաջողությամբ ավելացված է և համաժամեցված բազայի հետ');
        setIsOpen(false);
      } else {
        toast.error('Դասընթացի ավելացման ժամանակ սխալ է տեղի ունեցել');
      }
    } catch (error) {
      console.error('Error adding course:', error);
      toast.error('Դասընթացի ավելացման ժամանակ սխալ է տեղի ունեցել');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Ավելացնել նոր դասընթաց</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Նոր դասընթացի ավելացում</DialogTitle>
          <DialogDescription>
            Լրացրեք դասընթացի տվյալները ներքևում: Պատրաստ լինելուց հետո սեղմեք "Ավելացնել" կոճակը:
          </DialogDescription>
        </DialogHeader>
        <ProfessionalCourseForm
          course={newCourse}
          setCourse={setNewCourse}
        />
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Պահպանվում է...
              </>
            ) : 'Ավելացնել'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProfessionalCourseDialog;
