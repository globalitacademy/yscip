
import React, { useState } from 'react';
import { projectThemes, ProjectTheme } from '@/data/projectThemes';
import ProjectCard from './projects/ProjectCard';
import ProjectDeleteDialog from './projects/ProjectDeleteDialog';
import ProjectImageDialog from './projects/ProjectImageDialog';
import ProjectEditDialog from './projects/ProjectEditDialog';
import ProjectSearch from './projects/ProjectSearch';
import ProjectEmptyState from './projects/ProjectEmptyState';
import { deleteProject, changeProjectImage, saveEditedProject, filterProjects } from './projects/ProjectUtils';

const ProjectManagement: React.FC = () => {
  const [projects, setProjects] = useState(projectThemes);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<ProjectTheme | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [editedProject, setEditedProject] = useState<Partial<ProjectTheme>>({});
  
  // Get filtered projects
  const filteredProjects = filterProjects(projects, searchQuery);

  // Handle delete project
  const handleDelete = () => {
    if (!selectedProject) return;
    deleteProject(projects, selectedProject, setProjects);
    setIsDeleteDialogOpen(false);
    setSelectedProject(null);
  };

  // Handle change project image
  const handleChangeImage = () => {
    if (!selectedProject) return;
    changeProjectImage(projects, selectedProject, newImageUrl, setProjects);
    setIsImageDialogOpen(false);
    setNewImageUrl('');
    setSelectedProject(null);
  };

  // Handle edit project initialization
  const handleEditInit = (project: ProjectTheme) => {
    setSelectedProject(project);
    setEditedProject({
      title: project.title,
      description: project.description,
      category: project.category,
    });
    setIsEditDialogOpen(true);
  };

  // Handle save edited project
  const handleSaveEdit = () => {
    if (!selectedProject) return;
    saveEditedProject(projects, selectedProject, editedProject, setProjects);
    setIsEditDialogOpen(false);
    setEditedProject({});
    setSelectedProject(null);
  };

  // Handle image change initialization
  const handleImageChangeInit = (project: ProjectTheme) => {
    setSelectedProject(project);
    setNewImageUrl(project.image || '');
    setIsImageDialogOpen(true);
  };

  // Handle delete initialization
  const handleDeleteInit = (project: ProjectTheme) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Search and filter header */}
      <ProjectSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Project grid */}
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

      {/* Empty state when no projects match the filter */}
      {filteredProjects.length === 0 && <ProjectEmptyState />}

      {/* Dialogs */}
      <ProjectDeleteDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        selectedProject={selectedProject}
        onDelete={handleDelete}
      />

      <ProjectImageDialog 
        open={isImageDialogOpen}
        onOpenChange={setIsImageDialogOpen}
        selectedProject={selectedProject}
        newImageUrl={newImageUrl}
        setNewImageUrl={setNewImageUrl}
        onSave={handleChangeImage}
      />

      <ProjectEditDialog 
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        selectedProject={selectedProject}
        editedProject={editedProject}
        setEditedProject={setEditedProject}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default ProjectManagement;
