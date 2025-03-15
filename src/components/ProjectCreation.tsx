
import React from 'react';
import ProjectCreationForm from './project-creation/ProjectCreationForm';

interface ProjectCreationProps {
  onProjectCreated?: (project: any) => void;
}

const ProjectCreation: React.FC<ProjectCreationProps> = ({ onProjectCreated }) => {
  return <ProjectCreationForm onProjectCreated={onProjectCreated} />;
};

export default ProjectCreation;
