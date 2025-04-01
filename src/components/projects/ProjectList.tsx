import React from 'react';
import { ProjectTheme } from '@/data/projectThemes';
import ProjectCard from './ProjectCard';
import ProjectDialogManager from './ProjectDialogManager';
import { FadeIn } from '@/components/LocalTransitions';
import { useProjectManagement } from '@/contexts/ProjectManagementContext';
import { useAuth } from '@/contexts/AuthContext';

interface ProjectListProps {
  projects: ProjectTheme[];
}

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  const { user } = useAuth();
  
  // Filter to only show real projects from database (they have the is_public property)
  // Only show published projects (is_public === true) or projects created by the current user
  const filteredProjects = projects.filter(project => {
    // First check if it's a real project (has is_public property from database)
    const isRealProject = project.is_public !== undefined;
    
    if (!isRealProject) return false;
    
    // If user is admin, show all real projects
    if (user?.role === 'admin') return true;
    
    // If project is public, show it
    if (project.is_public === true) return true;
    
    // If project is not public, only show if it's created by the current user
    if (user && project.createdBy === user.id) return true;
    
    // Otherwise, don't show this project
    return false;
  });

  // Add safety check to handle undefined or null projects
  if (!filteredProjects || filteredProjects.length === 0) {
    return (
      <div className="text-center p-10 bg-muted rounded-lg">
        <p className="text-muted-foreground">Այս կատեգորիայում իրական նախագծեր չկան</p>
      </div>
    );
  }

  return (
    <>
      <FadeIn className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            className="h-full"
          />
        ))}
      </FadeIn>
      
      <ProjectDialogManager />
    </>
  );
};

export default ProjectList;
