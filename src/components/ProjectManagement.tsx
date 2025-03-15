
import React, { useState, useEffect } from 'react';
import { ProjectTheme } from '@/data/projectThemes';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import ProjectCreation from './ProjectCreation';
import ProjectList from './projects/ProjectList';
import ProjectFilterSection from './projects/ProjectFilterSection';
import ProjectDialogManager from './projects/ProjectDialogManager';
import { useProjectEvents } from './projects/hooks/useProjectEvents';
import { useProjectOperations } from '@/hooks/useProjectOperations';

const ProjectManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectTheme | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [editedProject, setEditedProject] = useState<Partial<ProjectTheme>>({});
  
  // Use our custom hook for project operations
  const {
    projects,
    setProjects,
    isLoading,
    loadProjects,
    updateProject,
    updateProjectImage,
    deleteProject,
    createProject
  } = useProjectOperations();
  
  // Set up real-time subscription to project changes
  useProjectEvents(setProjects);
  
  useEffect(() => {
    loadProjects();
  }, []);

  const handleDelete = async () => {
    if (!selectedProject) return;
    await deleteProject(selectedProject);
    setIsDeleteDialogOpen(false);
    setSelectedProject(null);
  };

  const handleChangeImage = async () => {
    if (!selectedProject) return;
    await updateProjectImage(selectedProject, newImageUrl);
    setIsImageDialogOpen(false);
    setNewImageUrl('');
    setSelectedProject(null);
  };

  const handleEditInit = (project: ProjectTheme) => {
    setSelectedProject(project);
    setEditedProject({
      title: project.title,
      description: project.description,
      category: project.category,
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedProject) return;
    await updateProject(selectedProject, editedProject);
    setIsEditDialogOpen(false);
    setEditedProject({});
    setSelectedProject(null);
  };

  const handleImageChangeInit = (project: ProjectTheme) => {
    setSelectedProject(project);
    setNewImageUrl(project.image || '');
    setIsImageDialogOpen(true);
  };

  const handleDeleteInit = (project: ProjectTheme) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  };

  const handleProjectCreated = async (project: ProjectTheme) => {
    await createProject(project);
    setIsCreateDialogOpen(false);
  };

  const handleOpenCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <ProjectFilterSection 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddNewProject={handleOpenCreateDialog}
        projects={projects}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <ProjectList 
        projects={projects}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        isLoading={isLoading}
        onEdit={handleEditInit}
        onImageChange={handleImageChangeInit}
        onDelete={handleDeleteInit}
        onAddNewProject={handleOpenCreateDialog}
      />

      <ProjectDialogManager
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        isImageDialogOpen={isImageDialogOpen}
        setIsImageDialogOpen={setIsImageDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        selectedProject={selectedProject}
        newImageUrl={newImageUrl}
        setNewImageUrl={setNewImageUrl}
        editedProject={editedProject}
        setEditedProject={setEditedProject}
        onDeleteConfirm={handleDelete}
        onImageSave={handleChangeImage}
        onEditSave={handleSaveEdit}
      />

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-y-auto max-h-screen">
          <ProjectCreation onProjectCreated={handleProjectCreated} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectManagement;
