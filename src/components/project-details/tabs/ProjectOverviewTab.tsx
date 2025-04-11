
import React from 'react';
import { useProject } from '@/contexts/ProjectContext';
import ProjectOverview from '@/components/project-details/ProjectOverview';

const ProjectOverviewTab: React.FC = () => {
  const { project, updateProject, isEditing } = useProject();

  const handleSaveChanges = async (updates: Partial<any>) => {
    // Update project with new data
    await updateProject(updates);
    return;
  };

  return (
    <ProjectOverview
      project={project}
      isEditing={isEditing}
      onSaveChanges={handleSaveChanges}
    />
  );
};

export default ProjectOverviewTab;
