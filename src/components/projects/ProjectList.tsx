
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
  // Add safety check to handle undefined or null projects
  if (!projects || projects.length === 0) {
    return (
      <div className="text-center p-10 bg-muted rounded-lg">
        <p className="text-muted-foreground">Այս կատեգորիայում ծրագրեր չկան</p>
      </div>
    );
  }

  return (
    <>
      <FadeIn className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {projects.map((project) => (
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
