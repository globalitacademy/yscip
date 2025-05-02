
import React, { useEffect } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import ProjectHeaderBanner from './ProjectHeaderBanner';

const ProjectHeader: React.FC = () => {
  const { project, isEditing, canEdit } = useProject();

  // Log state for debugging
  useEffect(() => {
    console.log("[ProjectHeader] Component mounted");
    console.log("- isEditing:", isEditing);
    console.log("- canEdit:", canEdit);
    console.log("- project:", project);
  }, [isEditing, canEdit, project]);

  if (!project) {
    console.log("[ProjectHeader] No project data available");
    return null;
  }
  
  return (
    <ProjectHeaderBanner 
      project={project} 
      isEditing={isEditing || false} 
    />
  );
};

export default ProjectHeader;
