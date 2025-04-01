
import React from 'react';
import ProjectDeleteDialog from './ProjectDeleteDialog';
import ProjectImageDialog from './ProjectImageDialog';
import ProjectEditDialog from './ProjectEditDialog';
import { useProjectManagement } from '@/contexts/ProjectManagementContext';

const ProjectDialogManager: React.FC = () => {
  const {
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

  // Only render the dialogs if there's a selected project and open state
  if (!selectedProject && (isDeleteDialogOpen || isImageDialogOpen || isEditDialogOpen)) {
    return null;
  }

  return (
    <>
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
    </>
  );
};

export default ProjectDialogManager;
