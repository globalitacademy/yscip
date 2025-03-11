
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThemeGrid from '@/components/ThemeGrid';
import CreatedProjectsTab from '@/components/tabs/CreatedProjectsTab';
import AssignedProjectsTab from '@/components/tabs/AssignedProjectsTab';
import TeachingProjectsTab from '@/components/tabs/TeachingProjectsTab';
import { DBUser } from '@/types/database.types';
import { projectThemes } from '@/data/projectThemes';

interface ProjectTabsProps {
  user: DBUser | null;
  createdProjects: any[];
  assignments: any[];
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({ 
  user, 
  createdProjects,
  assignments
}) => {
  // Combine project themes and created projects for project lookup
  const allProjects = [...projectThemes, ...createdProjects];

  return (
    <Tabs defaultValue="all-projects" className="mb-6">
      <TabsList className="h-auto mb-6">
        <TabsTrigger value="all-projects">Բոլոր Նախագծերը</TabsTrigger>
        {user?.role !== 'student' && (
          <TabsTrigger value="created-projects">Ստեղծված Նախագծեր</TabsTrigger>
        )}
        {user?.role === 'supervisor' && (
          <TabsTrigger value="assigned-projects">Հանձնարարված Նախագծեր</TabsTrigger>
        )}
        {user?.role === 'instructor' && (
          <TabsTrigger value="teaching-projects">Դասավանդվող Նախագծեր</TabsTrigger>
        )}
      </TabsList>
      
      <TabsContent value="all-projects">
        <ThemeGrid 
          createdProjects={createdProjects} 
        />
      </TabsContent>
      
      {user?.role !== 'student' && (
        <TabsContent value="created-projects">
          <CreatedProjectsTab user={user} createdProjects={createdProjects} />
        </TabsContent>
      )}
      
      {user?.role === 'supervisor' && (
        <TabsContent value="assigned-projects">
          <AssignedProjectsTab 
            user={user} 
            assignments={assignments} 
            allProjects={allProjects} 
          />
        </TabsContent>
      )}
      
      {user?.role === 'instructor' && (
        <TabsContent value="teaching-projects">
          <TeachingProjectsTab user={user} allProjects={allProjects} />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default ProjectTabs;
