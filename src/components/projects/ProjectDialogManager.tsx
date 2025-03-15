
import React from 'react';
import { ProjectTheme } from '@/data/projectThemes';
import ProjectDeleteDialog from './ProjectDeleteDialog';
import ProjectImageDialog from './ProjectImageDialog';
import ProjectEditDialog from './ProjectEditDialog';

interface ProjectDialogManagerProps {
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  isImageDialogOpen: boolean;
  setIsImageDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  selectedProject: ProjectTheme | null;
  newImageUrl: string;
  setNewImageUrl: (url: string) => void;
  editedProject: Partial<ProjectTheme>;
  setEditedProject: (project: Partial<ProjectTheme>) => void;
  onDeleteConfirm: () => void;
  onImageSave: () => void;
  onEditSave: () => void;
}

const ProjectDialogManager: React.FC<ProjectDialogManagerProps> = ({
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
  onDeleteConfirm,
  onImageSave,
  onEditSave
}) => {
  return (
    <>
      <ProjectDeleteDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        selectedProject={selectedProject}
        onDelete={onDeleteConfirm}
      />

      <ProjectImageDialog 
        open={isImageDialogOpen}
        onOpenChange={setIsImageDialogOpen}
        selectedProject={selectedProject}
        newImageUrl={newImageUrl}
        setNewImageUrl={setNewImageUrl}
        onSave={onImageSave}
      />

      <ProjectEditDialog 
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        selectedProject={selectedProject}
        editedProject={editedProject}
        setEditedProject={setEditedProject}
        onSave={onEditSave}
      />
    </>
  );
};

export default ProjectDialogManager;
