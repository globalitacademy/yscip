
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCoursePageContext } from '@/contexts/CoursePageContext';
import CourseOverviewTab from './CourseOverviewTab';
import CourseModulesTab from './CourseModulesTab';
import CourseSyllabusTab from './CourseSyllabusTab';
import CourseMaterialsTab from './CourseMaterialsTab';

const CourseTabs: React.FC = () => {
  const { activeTab, setActiveTab } = useCoursePageContext();
  
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab} 
      className="mb-8"
    >
      <TabsList className="mb-4">
        <TabsTrigger value="overview">Ընդհանուր</TabsTrigger>
        <TabsTrigger value="modules">Մոդուլներ</TabsTrigger>
        <TabsTrigger value="syllabus">Ուսումնական պլան</TabsTrigger>
        <TabsTrigger value="materials">Նյութեր</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <CourseOverviewTab />
      </TabsContent>

      <TabsContent value="modules">
        <CourseModulesTab />
      </TabsContent>

      <TabsContent value="syllabus">
        <CourseSyllabusTab />
      </TabsContent>

      <TabsContent value="materials">
        <CourseMaterialsTab />
      </TabsContent>
    </Tabs>
  );
};

export default CourseTabs;
