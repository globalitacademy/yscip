
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
    
    try {
      const success = await deleteProject(selectedProject);
      if (success) {
        setIsDeleteDialogOpen(false);
        setSelectedProject(null);
        
        queryClient.invalidateQueries({ queryKey: ['projects'] });
      } else {
        console.error('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  }, [selectedProject, deleteProject, queryClient, setIsDeleteDialogOpen, setSelectedProject]);

  const handleChangeImage = useCallback(async () => {
    if (!selectedProject) {
      console.error('No project selected for image update');
      return;
    }
    
    if (!newImageUrl || newImageUrl.trim() === '') {
      console.error('Image URL is empty');
      return;
    }
    
    console.log('Updating project image to:', newImageUrl);
    
    try {
      const success = await updateProjectImage(selectedProject, newImageUrl);
      
      if (success) {
        setIsImageDialogOpen(false);
        setNewImageUrl('');
        setSelectedProject(null);
        
        queryClient.invalidateQueries({ queryKey: ['projects'] });
      } else {
        console.error('Failed to update project image');
      }
    } catch (error) {
      console.error('Error updating project image:', error);
    }
  }, [selectedProject, newImageUrl, updateProjectImage, queryClient, setIsImageDialogOpen, setNewImageUrl, setSelectedProject]);

  const handleSaveEdit = useCallback(async () => {
    if (!selectedProject) {
      console.error('No project selected for editing');
      return;
    }
    
    // Make sure all required fields are included in the updates
    const updatesToSave = {
      ...editedProject,
      // Include these fields only if they're not already in editedProject
      title: editedProject.title || selectedProject.title,
      description: editedProject.description || selectedProject.description,
      category: editedProject.category || selectedProject.category,
      is_public: editedProject.is_public !== undefined ? editedProject.is_public : selectedProject.is_public
    };
    
    try {
      const success = await updateProject(selectedProject, updatesToSave);
      
      if (success) {
        setIsEditDialogOpen(false);
        setEditedProject({});
        setSelectedProject(null);
        
        queryClient.invalidateQueries({ queryKey: ['projects'] });
      } else {
        console.error('Failed to update project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  }, [selectedProject, editedProject, updateProject, queryClient, setIsEditDialogOpen, setEditedProject, setSelectedProject]);

  const handleProjectCreated = useCallback(async (project: ProjectTheme) => {
    try {
      const success = await createProject(project);
      
      if (success) {
        setIsCreateDialogOpen(false);
        queryClient.invalidateQueries({ queryKey: ['projects'] });
      } else {
        console.error('Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  }, [createProject, queryClient, setIsCreateDialogOpen]);

  return {
    handleDelete,
    handleChangeImage,
    handleSaveEdit,
    handleProjectCreated
  };
};
