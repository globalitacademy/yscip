
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
import { useTheme } from '@/hooks/use-theme';

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
  const { theme } = useTheme();
  
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
      <DialogContent className={`max-w-4xl max-h-[90vh] p-0 overflow-hidden ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        <DialogHeader className={`p-6 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} border-b`}>
          <DialogTitle className={theme === 'dark' ? 'text-gray-100' : ''}>Կուրսի խմբագրում</DialogTitle>
          <DialogDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
            Փոփոխեք կուրսի բոլոր տվյալները ստորև: Պատրաստ լինելուց հետո սեղմեք "Պահպանել" կոճակը:
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-grow overflow-hidden">
          <Tabs value={courseType} onValueChange={(value: 'standard' | 'professional') => setCourseType(value)} className="h-full flex flex-col">
            <div className="px-6 pt-4 shrink-0">
              <TabsList className={`grid grid-cols-2 w-full mb-4 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
                <TabsTrigger value="standard" className={theme === 'dark' ? 'data-[state=active]:bg-gray-700 data-[state=active]:text-indigo-300' : ''}>
                  Ստանդարտ դասընթաց
                </TabsTrigger>
                <TabsTrigger value="professional" className={theme === 'dark' ? 'data-[state=active]:bg-gray-700 data-[state=active]:text-indigo-300' : ''}>
                  Մասնագիտական դասընթաց
                </TabsTrigger>
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
        
        <DialogFooter className={`p-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} border-t mt-0 shrink-0`}>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            className={theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
          >
            Պահպանել
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCourseDialog;
