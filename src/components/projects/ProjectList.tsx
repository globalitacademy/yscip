
import React, { useMemo } from 'react';
import ProjectCard from './ProjectCard';
import ProjectEmptyState from './ProjectEmptyState';
import { filterProjects } from './ProjectUtils';
import { useProjectManagement } from '@/contexts/ProjectManagementContext';

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {filteredProjects.map((project) => (
        <ProjectCard 
          key={project.id}
          project={project}
          onEdit={handleEditInit}
          onImageChange={handleImageChangeInit}
          onDelete={handleDeleteInit}
        />
      ))}
    </div>
  );
};

export default ProjectList;
