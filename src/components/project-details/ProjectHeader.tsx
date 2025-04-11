
import React from 'react';
import { useProject } from '@/contexts/ProjectContext';
import ProjectHeaderBanner from './ProjectHeaderBanner';

const ProjectHeader: React.FC = () => {
  const { project } = useProject();

  if (!project) return null;
  
  return <ProjectHeaderBanner project={project} />;
};

export default ProjectHeader;
