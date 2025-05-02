
import React from 'react';
import { useProject } from '@/contexts/ProjectContext';
import ProjectHeaderBanner from './ProjectHeaderBanner';

const ProjectHeader: React.FC = () => {
  const { project, isEditing, canEdit } = useProject();

  // Log state for debugging
  React.useEffect(() => {
    console.log("ProjectHeader component mounted");
    console.log("Project header - isEditing:", isEditing);
    console.log("Project header - canEdit:", canEdit);
  }, [isEditing, canEdit]);

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
