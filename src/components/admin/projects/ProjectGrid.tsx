
import React from 'react';
import { ProjectTheme } from '@/data/projectThemes';
import ProjectCard from '@/components/projects/ProjectCard';
import { FadeIn } from '@/components/LocalTransitions';
import { useProjectPermissions } from '@/hooks/useProjectPermissions';
import { useProjectManagement } from '@/contexts/ProjectManagementContext';

interface ProjectGridProps {
  projects: ProjectTheme[];
  onSelectProject: (project: ProjectTheme, action: 'assign' | 'approve') => void;
  onEditProject: (project: ProjectTheme) => void;
  onImageChange: (project: ProjectTheme) => void;
  onDeleteProject: (project: ProjectTheme) => void;
  userRole?: string;
}

const ProjectGrid: React.FC<ProjectGridProps> = ({
  projects,
  onSelectProject,
  onEditProject,
  onImageChange,
  onDeleteProject,
  userRole
}) => {
  const permissions = useProjectPermissions(userRole);
  const { handleEditInit, handleImageChangeInit, handleDeleteInit } = useProjectManagement();

  // Function to handle project editing with both local and context methods
  const handleEdit = (project: ProjectTheme) => {
    // Call both handlers to ensure compatibility
    if (onEditProject) onEditProject(project);
    handleEditInit(project);
  };
  
  // Function to handle image changes with both local and context methods
  const handleImageChange = (project: ProjectTheme) => {
    if (onImageChange) onImageChange(project);
    handleImageChangeInit(project);
  };
  
  // Function to handle project deletion with both local and context methods
  const handleDelete = (project: ProjectTheme) => {
    if (onDeleteProject) onDeleteProject(project);
    handleDeleteInit(project);
  };

  if (projects.length === 0) {
    return (
      <div className="text-center p-10 bg-muted rounded-lg">
        <p className="text-muted-foreground">Այս կատեգորիայում ծրագրեր չկան</p>
      </div>
    );
  }

  return (
    <FadeIn className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      {projects.map((project) => (
        <div key={project.id} className="relative card-hover">
          <ProjectCard
            project={project}
            onEdit={handleEdit}
            onImageChange={handleImageChange}
            onDelete={handleDelete}
          />
        </div>
      ))}
    </FadeIn>
  );
};

export default ProjectGrid;
