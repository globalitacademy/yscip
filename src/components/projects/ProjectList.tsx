
import React, { useMemo } from 'react';
import { ProjectTheme } from '@/data/projectThemes';
import ProjectCard from './ProjectCard';
import ProjectEmptyState from './ProjectEmptyState';
import { filterProjects } from './ProjectUtils';

interface ProjectListProps {
  projects: ProjectTheme[];
  searchQuery: string;
  selectedCategory: string | null;
  isLoading: boolean;
  onEdit: (project: ProjectTheme) => void;
  onImageChange: (project: ProjectTheme) => void;
  onDelete: (project: ProjectTheme) => void;
  onAddNewProject: () => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  searchQuery,
  selectedCategory,
  isLoading,
  onEdit,
  onImageChange,
  onDelete,
  onAddNewProject
}) => {
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
    return <ProjectEmptyState onAddNewProject={onAddNewProject} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {filteredProjects.map((project) => (
        <ProjectCard 
          key={project.id}
          project={project}
          onEdit={onEdit}
          onImageChange={onImageChange}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ProjectList;
