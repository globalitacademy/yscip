import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThemeGrid from '@/components/ThemeGrid';
import CreatedProjectsTab from './CreatedProjectsTab';
import AssignedProjectsTab from './AssignedProjectsTab';
import TeachingProjectsTab from './TeachingProjectsTab';
import ProjectList from './ProjectList';
import { ProjectTheme } from '@/data/projectThemes';
import { ProjectManagementProvider, useProjectManagement } from '@/contexts/ProjectManagementContext';

interface ProjectTabsProps {
  user: any;
  createdProjects: any[];
  assignments: any[];
  projectThemes: ProjectTheme[];
}

const ProjectListWithContext: React.FC = () => {
  const { projects } = useProjectManagement();
  return <ProjectList projects={projects} />;
};

const ProjectTabs: React.FC<ProjectTabsProps> = ({ 
  user, 
  createdProjects, 
  assignments, 
  projectThemes 
}) => {
  const allProjects = [...projectThemes, ...createdProjects];

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-6">Նախագծեր</h2>
      
      <ProjectManagementProvider>
        <ProjectListWithContext />
      </ProjectManagementProvider>
      
      {/* Original tabs - keeping as a fallback option 
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
          <ThemeGrid 
            createdProjects={createdProjects} 
          />
        </TabsContent>
        
        {user?.role !== 'student' && (
          <TabsContent value="created-projects">
            <CreatedProjectsTab projects={createdProjects} userId={user?.id} />
          </TabsContent>
        )}
        
        {user?.role === 'supervisor' && (
          <TabsContent value="assigned-projects">
            <AssignedProjectsTab 
              assignments={assignments} 
              userId={user?.id} 
              allProjects={allProjects}
            />
          </TabsContent>
        )}
        
        {user?.role === 'instructor' && (
          <TabsContent value="teaching-projects">
            <TeachingProjectsTab 
              assignedProjects={user.assignedProjects} 
              allProjects={allProjects}
            />
          </TabsContent>
        )}
      </Tabs>
      */}
    </div>
  );
};

export default ProjectTabs;
