
import React from 'react';
import ProjectCard from '@/components/ProjectCard';
import { FadeIn } from '@/components/LocalTransitions';

interface ProjectGridProps {
  projects: any[];
}

const ProjectGrid: React.FC<ProjectGridProps> = ({ projects }) => {
  if (projects.length === 0) {
    return (
      <div className="text-center p-10 bg-muted rounded-lg">
        <p className="text-muted-foreground">Այս կատեգորիայում ծրագրեր չկան</p>
      </div>
    );
  }

  return (
    <FadeIn className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </FadeIn>
  );
};

export default ProjectGrid;
