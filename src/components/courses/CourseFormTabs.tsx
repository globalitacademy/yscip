
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfessionalCourseForm from './ProfessionalCourseForm';
import { ProfessionalCourse } from './types';

interface CourseFormTabsProps {
  courseType: 'standard' | 'professional';
  setCourseType: (type: 'standard' | 'professional') => void;
  professionalCourse: Partial<ProfessionalCourse> | null;
  setProfessionalCourse: (course: Partial<ProfessionalCourse>) => void;
}

const CourseFormTabs: React.FC<CourseFormTabsProps> = ({
  courseType,
  setCourseType,
  professionalCourse,
  setProfessionalCourse
}) => {
  return (
    <CardContent className="space-y-6">
      <Tabs value={courseType} onValueChange={(value: 'standard' | 'professional') => setCourseType(value)}>
        <TabsList className="grid grid-cols-1 w-full">
          <TabsTrigger value="professional">Մասնագիտական դասընթաց</TabsTrigger>
        </TabsList>
        
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
  );
};

export default CourseFormTabs;
