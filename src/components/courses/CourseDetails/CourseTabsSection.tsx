
import React from 'react';
import { Course } from '@/components/courses/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CourseModulesTab from './tabs/CourseModulesTab';
import CourseProgramTab from './tabs/CourseProgramTab';
import CourseRequirementsTab from './tabs/CourseRequirementsTab';

interface CourseTabsSectionProps {
  course: Course;
}

const CourseTabsSection: React.FC<CourseTabsSectionProps> = ({ course }) => {
  return (
    <Tabs defaultValue="modules" className="mb-8">
      <TabsList className="mb-4">
        <TabsTrigger value="modules">Մոդուլներ</TabsTrigger>
        <TabsTrigger value="program">Ծրագիր</TabsTrigger>
        <TabsTrigger value="requirements">Պահանջներ</TabsTrigger>
      </TabsList>

      <TabsContent value="modules">
        <CourseModulesTab modules={course.modules || []} />
      </TabsContent>

      <TabsContent value="program">
        <CourseProgramTab />
      </TabsContent>

      <TabsContent value="requirements">
        <CourseRequirementsTab />
      </TabsContent>
    </Tabs>
  );
};

export default CourseTabsSection;
