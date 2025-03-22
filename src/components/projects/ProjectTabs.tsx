
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThemeGrid from '@/components/ThemeGrid';
import CreatedProjectsTab from './CreatedProjectsTab';
import AssignedProjectsTab from './AssignedProjectsTab';
import TeachingProjectsTab from './TeachingProjectsTab';

interface ProjectTabsProps {
  user: any;
  createdProjects: any[];
  assignments: any[];
  projectThemes: any[];
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({ 
  user, 
  assignments, 
  projectThemes 
}) => {
  return (
    <Tabs defaultValue="all-projects" className="mb-6">
      <TabsList className="h-auto mb-6 w-full flex flex-wrap gap-2 justify-start sm:justify-center">
        <TabsTrigger value="all-projects" className="flex-grow sm:flex-grow-0">Բոլոր Նախագծերը</TabsTrigger>
        {user?.role !== 'student' && (
          <TabsTrigger value="created-projects" className="flex-grow sm:flex-grow-0">Ստեղծված Նախագծեր</TabsTrigger>
        )}
        {user?.role === 'supervisor' && (
          <TabsTrigger value="assigned-projects" className="flex-grow sm:flex-grow-0">Հանձնարարված Նախագծեր</TabsTrigger>
        )}
        {user?.role === 'instructor' && (
          <TabsTrigger value="teaching-projects" className="flex-grow sm:flex-grow-0">Դասավանդվող Նախագծեր</TabsTrigger>
        )}
      </TabsList>
      
      <TabsContent value="all-projects">
        <ThemeGrid />
      </TabsContent>
      
      {user?.role !== 'student' && (
        <TabsContent value="created-projects">
          <CreatedProjectsTab userId={user?.id} />
        </TabsContent>
      )}
      
      {user?.role === 'supervisor' && (
        <TabsContent value="assigned-projects">
          <AssignedProjectsTab 
            assignments={assignments} 
            userId={user?.id} 
            allProjects={projectThemes}
          />
        </TabsContent>
      )}
      
      {user?.role === 'instructor' && (
        <TabsContent value="teaching-projects">
          <TeachingProjectsTab 
            assignedProjects={user.assignedProjects} 
            allProjects={projectThemes}
          />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default ProjectTabs;
