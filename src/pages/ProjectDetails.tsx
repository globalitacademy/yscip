
import React from 'react';
import { useParams } from 'react-router-dom';
import { projectThemes } from '@/data/projectThemes';
import { ProjectProvider } from '@/contexts/ProjectContext';
import ProjectDetailsContent from '@/components/project-details/ProjectDetailsContent';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = id ? parseInt(id) : null;
  const project = projectThemes.find(p => p.id === projectId) || null;
  
  return (
    <ProjectProvider projectId={projectId} initialProject={project}>
      <ProjectDetailsContent />
    </ProjectProvider>
  );
};

export default ProjectDetails;
