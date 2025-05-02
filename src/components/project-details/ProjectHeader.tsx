
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '@/contexts/ProjectContext';
import ProjectHeaderBanner from './ProjectHeaderBanner';

const ProjectHeader: React.FC = () => {
  const { project, isEditing, canEdit } = useProject();

  if (!project) return null;
  
  // Always ensure ProjectHeaderBanner receives the current editing state
  return (
    <ProjectHeaderBanner 
      project={project} 
      isEditing={isEditing || false} 
    />
  );
};

export default ProjectHeader;
