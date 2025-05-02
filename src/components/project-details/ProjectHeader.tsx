
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '@/contexts/ProjectContext';
import { ProjectTheme } from '@/data/projectThemes';
import ProjectHeaderBanner from './ProjectHeaderBanner';

const ProjectHeader: React.FC = () => {
  const navigate = useNavigate();
  const { project, isEditing, canEdit } = useProject();

  if (!project) return null;
  
  return (
    <ProjectHeaderBanner 
      project={project} 
      isEditing={isEditing || false} 
    />
  );
};

export default ProjectHeader;
