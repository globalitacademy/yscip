
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ProfessionalCourseForm from './ProfessionalCourseForm';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface EditProfessionalCourseDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedCourse: ProfessionalCourse | null;
  setSelectedCourse: React.Dispatch<React.SetStateAction<ProfessionalCourse | null>>;
  handleEditCourse: () => void;
}

const EditProfessionalCourseDialog: React.FC<EditProfessionalCourseDialogProps> = ({
  isOpen,
  setIsOpen,
  selectedCourse,
  setSelectedCourse,
  handleEditCourse
}) => {
  if (!selectedCourse) return null;
  
  const saveChanges = () => {
    if (!selectedCourse) return;
    
    try {
      // Update the course in localStorage
      const storedCourses = localStorage.getItem('professionalCourses');
      if (storedCourses) {
        const courses: ProfessionalCourse[] = JSON.parse(storedCourses);
        const updatedCourses = courses.map(course => 
          course.id === selectedCourse.id ? selectedCourse : course
        );
        
        localStorage.setItem('professionalCourses', JSON.stringify(updatedCourses));
      }
      
      // Call the provided edit handler from the parent component
      handleEditCourse();
      
      toast.success('Դասընթացը հաջողությամբ թարմացվել է');
    } catch (error) {
      console.error('Error saving course changes:', error);
      toast.error('Դասընթացի պահպանման ժամանակ սխալ է տեղի ունեցել');
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Դասընթացի խմբագրում</DialogTitle>
          <DialogDescription>
            Խմբագրեք դասընթացի տվյալները: Պատրաստ լինելուց հետո սեղմեք "Պահպանել" կոճակը:
          </DialogDescription>
        </DialogHeader>
        <ProfessionalCourseForm
          course={selectedCourse}
          setCourse={(updatedCourse) => setSelectedCourse({...selectedCourse, ...updatedCourse})}
          isEdit={true}
        />
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
