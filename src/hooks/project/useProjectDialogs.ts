
import { useCallback } from 'react';
import { ProjectTheme } from '@/data/projectThemes';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Hook for handling project dialog actions (delete, image change, edit)
 */
export const useProjectDialogs = (
  selectedProject: ProjectTheme | null,
  newImageUrl: string,
  editedProject: Partial<ProjectTheme>,
  deleteProject: (project: ProjectTheme) => Promise<boolean>,
  updateProject: (project: ProjectTheme, updates: Partial<ProjectTheme>) => Promise<boolean>,
  updateProjectImage: (project: ProjectTheme, imageUrl: string) => Promise<boolean>,
  createProject: (project: ProjectTheme) => Promise<boolean>,
  setIsDeleteDialogOpen: (isOpen: boolean) => void,
  setIsImageDialogOpen: (isOpen: boolean) => void,
  setIsEditDialogOpen: (isOpen: boolean) => void,
  setIsCreateDialogOpen: (isOpen: boolean) => void,
  setSelectedProject: (project: ProjectTheme | null) => void,
  setNewImageUrl: (url: string) => void,
  setEditedProject: (project: Partial<ProjectTheme>) => void
) => {
  const queryClient = useQueryClient();
  
  const handleDelete = useCallback(async () => {
    if (!selectedProject) return;
    await deleteProject(selectedProject);
    setIsDeleteDialogOpen(false);
    setSelectedProject(null);
    
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  }, [selectedProject, deleteProject, queryClient, setIsDeleteDialogOpen, setSelectedProject]);

  const handleChangeImage = useCallback(async () => {
    if (!selectedProject) return;
    await updateProjectImage(selectedProject, newImageUrl);
    setIsImageDialogOpen(false);
    setNewImageUrl('');
    setSelectedProject(null);
    
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  }, [selectedProject, newImageUrl, updateProjectImage, queryClient, setIsImageDialogOpen, setNewImageUrl, setSelectedProject]);

  const handleSaveEdit = useCallback(async () => {
    if (!selectedProject) return;
    await updateProject(selectedProject, editedProject);
    setIsEditDialogOpen(false);
    setEditedProject({});
    setSelectedProject(null);
    
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  }, [selectedProject, editedProject, updateProject, queryClient, setIsEditDialogOpen, setEditedProject, setSelectedProject]);

  const handleProjectCreated = useCallback(async (project: ProjectTheme) => {
    await createProject(project);
    setIsCreateDialogOpen(false);
    
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  }, [createProject, queryClient, setIsCreateDialogOpen]);

  return {
    handleDelete,
    handleChangeImage,
    handleSaveEdit,
    handleProjectCreated
  };
};
