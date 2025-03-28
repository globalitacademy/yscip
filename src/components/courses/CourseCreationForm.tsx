
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CourseForm from './CourseForm';
import ProfessionalCourseForm from './ProfessionalCourseForm';
import { Course } from './types';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import { useCourseContext } from '@/contexts/CourseContext';
import ProjectFormFooter from '../project-creation/ProjectFormFooter';

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
    handleCreateCourse
  } = useCourseContext();

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
            <ProfessionalCourseForm
              course={professionalCourse}
              setCourse={setProfessionalCourse}
              isEdit={false}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <ProjectFormFooter onSubmit={handleCreateCourse} />
    </Card>
  );
};

export default CourseCreationForm;
