
import React, { useMemo } from 'react';
import { filterProjects } from './ProjectUtils';
import { useProjectManagement } from '@/contexts/ProjectManagementContext';
import ProjectCard from '@/components/ProjectCard';
import ProjectEmptyState from './ProjectEmptyState';

const ProjectList: React.FC = () => {
  const {
    projects,
    searchQuery,
    selectedCategory,
    isLoading,
    handleEditInit,
    handleImageChangeInit,
    handleDeleteInit,
    handleOpenCreateDialog
  } = useProjectManagement();

  const filteredProjects = useMemo(() => {
    return filterProjects(projects, searchQuery, selectedCategory);
  }, [projects, searchQuery, selectedCategory]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (filteredProjects.length === 0) {
    return <ProjectEmptyState onAddNewProject={handleOpenCreateDialog} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProjects.map((project) => (
        <ProjectCard 
          key={project.id}
          project={project}
          className="h-full"
        />
      ))}
    </div>
  );
};

export default ProjectList;
