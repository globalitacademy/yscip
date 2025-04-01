
import React from 'react';
import { ProjectTheme } from '@/data/projectThemes';
import ProjectCard from './ProjectCard';
import ProjectDialogManager from './ProjectDialogManager';
import { FadeIn } from '@/components/LocalTransitions';
import { useProjectManagement } from '@/contexts/ProjectManagementContext';

interface ProjectListProps {
  projects: ProjectTheme[];
}

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  // Filter to only show real projects from database (they have the is_public property)
  const realProjects = projects.filter(project => project.is_public !== undefined);

  // Add safety check to handle undefined or null projects
  if (!realProjects || realProjects.length === 0) {
    return (
      <div className="text-center p-10 bg-muted rounded-lg">
        <p className="text-muted-foreground">Այս կատեգորիայում իրական նախագծեր չկան</p>
      </div>
    );
  }

  return (
    <>
      <FadeIn className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {realProjects.map((project) => (
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
