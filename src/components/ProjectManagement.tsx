
import React, { useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import ProjectCreation from './ProjectCreation';
import ProjectList from './projects/ProjectList';
import ProjectFilterSection from './projects/ProjectFilterSection';
import ProjectDialogManager from './projects/ProjectDialogManager';
import { ProjectManagementProvider, useProjectManagement } from '@/contexts/ProjectManagementContext';

// Inner component that uses the context
const ProjectManagementContent: React.FC = () => {
  const {
    searchQuery,
    selectedCategory,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    projects,
    isLoading,
    loadProjects,
    handleEditInit,
    handleImageChangeInit,
    handleDeleteInit,
    handleProjectCreated,
    handleOpenCreateDialog,
    setSearchQuery,
    setSelectedCategory,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isImageDialogOpen,
    setIsImageDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedProject,
    newImageUrl,
    setNewImageUrl,
    editedProject,
    setEditedProject,
    handleDelete,
    handleChangeImage,
    handleSaveEdit
  } = useProjectManagement();
  
  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, []);

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

// Main component that provides the context
const ProjectManagement: React.FC = () => {
  return (
    <ProjectManagementProvider>
      <ProjectManagementContent />
    </ProjectManagementProvider>
  );
};

export default ProjectManagement;
