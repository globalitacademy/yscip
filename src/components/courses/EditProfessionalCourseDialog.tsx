
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ProfessionalCourseForm from './ProfessionalCourseForm';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import { toast } from 'sonner';
import { saveCourseChanges } from './utils/courseUtils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EditProfessionalCourseDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedCourse: ProfessionalCourse | null;
  setSelectedCourse: React.Dispatch<React.SetStateAction<ProfessionalCourse | null>>;
  handleEditCourse: (id: string, courseData: Partial<ProfessionalCourse>) => Promise<boolean>;
}

const EditProfessionalCourseDialog: React.FC<EditProfessionalCourseDialogProps> = ({
  isOpen,
  setIsOpen,
  selectedCourse,
  setSelectedCourse,
  handleEditCourse
}) => {
  if (!selectedCourse) return null;
  
  const saveChanges = async () => {
    if (!selectedCourse) return;
    
    try {
      // Save course to Supabase
      const success = await saveCourseChanges(selectedCourse);
      
      if (success) {
        // Call the provided edit handler from the parent component
        await handleEditCourse(selectedCourse.id, selectedCourse);
        
        toast.success('Դասընթացը հաջողությամբ թարմացվել է');
        setIsOpen(false);
      } else {
        toast.error('Դասընթացի պահպանման ժամանակ սխալ է տեղի ունեցել');
      }
    } catch (error) {
      console.error('Error saving course changes:', error);
      toast.error('Դասընթացի պահպանման ժամանակ սխալ է տեղի ունեցել');
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Դասընթացի խմբագրում</DialogTitle>
          <DialogDescription>
            Խմբագրեք դասընթացի տվյալները: Պատրաստ լինելուց հետո սեղմեք "Պահպանել" կոճակը:
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <ProfessionalCourseForm
            course={selectedCourse}
            setCourse={(updatedCourse) => setSelectedCourse({...selectedCourse, ...updatedCourse})}
            isEdit={true}
          />
        </ScrollArea>
        <DialogFooter>
          <Button type="submit" onClick={saveChanges}>
            Պահպանել
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfessionalCourseDialog;
