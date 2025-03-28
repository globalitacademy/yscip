
import React, { useState } from 'react';
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
    } else if (courseType === 'professional' && professionalCourse && professionalCourse.id) {
      // This would be handled separately for professional courses
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Կուրսի խմբագրում</DialogTitle>
          <DialogDescription>
            Փոփոխեք կուրսի բոլոր տվյալները ստորև: Պատրաստ լինելուց հետո սեղմեք "Պահպանել" կոճակը:
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={courseType} onValueChange={(value: 'standard' | 'professional') => setCourseType(value)}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="standard">Ստանդարտ դասընթաց</TabsTrigger>
            <TabsTrigger value="professional">Մասնագիտական դասընթաց</TabsTrigger>
          </TabsList>
          
          <TabsContent value="standard">
            {selectedCourse && (
              <CourseForm
                course={selectedCourse}
                setCourse={(newCourse) => setSelectedCourse(newCourse as Course)}
                newModule={newModule}
                setNewModule={setNewModule}
                handleAddModule={handleAddModuleToEdit}
                handleRemoveModule={handleRemoveModuleFromEdit}
                isEdit={true}
              />
            )}
          </TabsContent>
          
          <TabsContent value="professional">
            {professionalCourse && setProfessionalCourse && (
              <ProfessionalCourseForm
                course={professionalCourse}
                setCourse={setProfessionalCourse}
                isEdit={true}
              />
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Պահպանել
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCourseDialog;
