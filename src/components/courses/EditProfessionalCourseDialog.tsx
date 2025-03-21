
import React, { useState } from 'react';
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
  handleEditCourse: () => void;
}

const EditProfessionalCourseDialog: React.FC<EditProfessionalCourseDialogProps> = ({
  isOpen,
  setIsOpen,
  selectedCourse,
  setSelectedCourse,
  handleEditCourse
}) => {
  const [isSaving, setIsSaving] = useState(false);
  
  if (!selectedCourse) return null;
  
  const saveChanges = async () => {
    if (!selectedCourse) return;
    
    setIsSaving(true);
    try {
      // Ensure iconName is set if icon is present
      if (selectedCourse.icon && !selectedCourse.iconName) {
        const iconString = (selectedCourse.icon.type as any)?.name || '';
        if (iconString.includes('Book')) selectedCourse.iconName = 'book';
        else if (iconString.includes('Code')) selectedCourse.iconName = 'code';
        else if (iconString.includes('Brain')) selectedCourse.iconName = 'ai';
        else if (iconString.includes('Database')) selectedCourse.iconName = 'database';
        else if (iconString.includes('File')) selectedCourse.iconName = 'files';
        else if (iconString.includes('Globe')) selectedCourse.iconName = 'web';
        else selectedCourse.iconName = 'book';
      }
      
      // Ensure preferIcon has a boolean value
      if (selectedCourse.preferIcon === undefined) {
        selectedCourse.preferIcon = true;
      }
      
      // Save course to Supabase
      const success = await saveCourseChanges(selectedCourse);
      
      if (success) {
        // Call the provided edit handler from the parent component
        handleEditCourse();
        
        toast.success('Դասընթացը հաջողությամբ թարմացվել է');
        setIsOpen(false);
      } else {
        toast.error('Դասընթացի պահպանման ժամանակ սխալ է տեղի ունեցել');
      }
    } catch (error) {
      console.error('Error saving course changes:', error);
      toast.error('Դասընթացի պահպանման ժամանակ սխալ է տեղի ունեցել');
    } finally {
      setIsSaving(false);
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
            setCourse={(updatedCourse) => {
              // Create deep copy to avoid reference issues
              setSelectedCourse({
                ...JSON.parse(JSON.stringify(selectedCourse)),
                ...updatedCourse
              });
            }}
            isEdit={true}
          />
        </ScrollArea>
        <DialogFooter>
          <Button type="submit" onClick={saveChanges} disabled={isSaving}>
            {isSaving ? 'Պահպանվում է...' : 'Պահպանել'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfessionalCourseDialog;
