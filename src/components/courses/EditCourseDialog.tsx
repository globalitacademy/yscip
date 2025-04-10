
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import CourseForm from './CourseForm';
import ProfessionalCourseForm from './ProfessionalCourseForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Course } from './types';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EditCourseDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedCourse: Course | null;
  setSelectedCourse: React.Dispatch<React.SetStateAction<Course | null>>;
  newModule: string;
  setNewModule: React.Dispatch<React.SetStateAction<string>>;
  handleAddModuleToEdit: () => void;
  handleRemoveModuleFromEdit: (index: number) => void;
  handleEditCourse: (id: string, courseData: Partial<Course>) => Promise<boolean>;
  isProfessionalCourse?: boolean;
  professionalCourse?: Partial<ProfessionalCourse> | null;
  setProfessionalCourse?: React.Dispatch<React.SetStateAction<Partial<ProfessionalCourse> | null>>;
  courseType: 'standard' | 'professional';
  setCourseType: (type: 'standard' | 'professional') => void;
}

const EditCourseDialog: React.FC<EditCourseDialogProps> = ({
  isOpen,
  setIsOpen,
  selectedCourse,
  setSelectedCourse,
  newModule,
  setNewModule,
  handleAddModuleToEdit,
  handleRemoveModuleFromEdit,
  handleEditCourse,
  isProfessionalCourse = false,
  professionalCourse,
  setProfessionalCourse,
  courseType,
  setCourseType
}) => {
  if (!selectedCourse && !professionalCourse) return null;

  const handleSubmit = () => {
    if (courseType === 'standard' && selectedCourse) {
      handleEditCourse(selectedCourse.id, selectedCourse);
    } else if (courseType === 'professional' && professionalCourse && professionalCourse.id && setProfessionalCourse) {
      // Handle professional course update if we have proper id and setter
      handleEditCourse(professionalCourse.id as string, professionalCourse as any);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b">
          <DialogTitle>Կուրսի խմբագրում</DialogTitle>
          <DialogDescription>
            Փոփոխեք կուրսի բոլոր տվյալները ստորև: Պատրաստ լինելուց հետո սեղմեք "Պահպանել" կոճակը:
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-grow overflow-hidden">
          <Tabs value={courseType} onValueChange={(value: 'standard' | 'professional') => setCourseType(value)} className="h-full flex flex-col">
            <div className="px-6 pt-4 shrink-0">
              <TabsList className="grid grid-cols-2 w-full mb-4">
                <TabsTrigger value="standard">Ստանդարտ դասընթաց</TabsTrigger>
                <TabsTrigger value="professional">Մասնագիտական դասընթաց</TabsTrigger>
              </TabsList>
            </div>
            
            <ScrollArea className="px-6 flex-grow h-[calc(90vh-220px)]">
              <div className="pb-6">
                <TabsContent value="standard" className="mt-0">
                  {selectedCourse && (
                    <CourseForm
                      course={selectedCourse}
                      setCourse={(updatedCourse) => setSelectedCourse(updatedCourse as Course)}
                      newModule={newModule}
                      setNewModule={setNewModule}
                      handleAddModule={handleAddModuleToEdit}
                      handleRemoveModule={handleRemoveModuleFromEdit}
                      isEdit={true}
                    />
                  )}
                </TabsContent>
                
                <TabsContent value="professional" className="mt-0">
                  {professionalCourse && setProfessionalCourse && (
                    <ProfessionalCourseForm
                      course={professionalCourse}
                      setCourse={setProfessionalCourse}
                      isEdit={true}
                    />
                  )}
                </TabsContent>
              </div>
            </ScrollArea>
          </Tabs>
        </div>
        
        <DialogFooter className="p-4 border-t mt-0 shrink-0">
          <Button type="submit" onClick={handleSubmit}>
            Պահպանել
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCourseDialog;
