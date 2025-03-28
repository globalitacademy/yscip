
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CourseForm from './CourseForm';
import ProfessionalCourseForm from './ProfessionalCourseForm';
import { Course } from './types/index';
import { ProfessionalCourse } from './types/index';
import { useCourseContext } from '@/contexts/CourseContext';
import ProjectFormFooter from '../project-creation/ProjectFormFooter';
import { toast } from '@/components/ui/use-toast';

const CourseCreationForm: React.FC = () => {
  const { 
    selectedCourse, 
    professionalCourse,
    courseType,
    setCourseType,
    setSelectedCourse, 
    setProfessionalCourse, 
    newModule,
    setNewModule,
    handleAddModuleToEdit,
    handleRemoveModuleFromEdit,
    handleCreateCourse,
    handleCreateProfessionalCourse
  } = useCourseContext();

  const handleSubmit = async () => {
    try {
      if (courseType === 'standard' && selectedCourse) {
        const success = await handleCreateCourse(selectedCourse as Omit<Course, 'id' | 'createdAt'>);
        if (success) {
          toast({
            title: "Դասընթացը ստեղծված է",
            description: "Ստանդարտ դասընթացը հաջողությամբ ստեղծվել է։",
          });
          return true;
        }
      } else if (courseType === 'professional' && professionalCourse) {
        const success = await handleCreateProfessionalCourse(professionalCourse as Omit<ProfessionalCourse, 'id' | 'createdAt'>);
        if (success) {
          toast({
            title: "Դասընթացը ստեղծված է",
            description: "Մասնագիտական դասընթացը հաջողությամբ ստեղծվել է։",
          });
          return true;
        }
      } else {
        toast({
          title: "Սխալ",
          description: "Լրացրեք բոլոր պարտադիր դաշտերը",
          variant: "destructive",
        });
      }
      return false;
    } catch (error) {
      console.error("Error creating course:", error);
      toast({
        title: "Սխալ",
        description: "Դասընթացի ստեղծման ժամանակ սխալ է տեղի ունեցել",
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Նոր դասընթացի ստեղծում</CardTitle>
        <CardDescription>Ստեղծեք նոր դասընթաց ձեր ուսանողների համար</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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
                isEdit={false}
              />
            )}
          </TabsContent>
          
          <TabsContent value="professional">
            {professionalCourse && (
              <ProfessionalCourseForm
                course={professionalCourse}
                setCourse={setProfessionalCourse}
                isEdit={false}
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <ProjectFormFooter onSubmit={handleSubmit} />
    </Card>
  );
};

export default CourseCreationForm;
