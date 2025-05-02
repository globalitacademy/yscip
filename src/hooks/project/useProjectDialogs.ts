
import { useCallback } from 'react';
import { ProjectTheme } from '@/data/projectThemes';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

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
      await deleteProject(selectedProject);
      toast.success("Նախագիծը հաջողությամբ ջնջվեց");
      setIsDeleteDialogOpen(false);
      setSelectedProject(null);
      
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    } catch (error) {
      toast.error("Նախագծի ջնջման ընթացքում առաջացավ սխալ");
      console.error("Error deleting project:", error);
    }
  }, [selectedProject, deleteProject, queryClient, setIsDeleteDialogOpen, setSelectedProject]);

  const handleChangeImage = useCallback(async () => {
    if (!selectedProject) return;
    
    try {
      await updateProjectImage(selectedProject, newImageUrl);
      toast.success("Նախագծի նկարը հաջողությամբ թարմացվեց");
      setIsImageDialogOpen(false);
      setNewImageUrl('');
      setSelectedProject(null);
      
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    } catch (error) {
      toast.error("Նկարի թարմացման ընթացքում առաջացավ սխալ");
      console.error("Error updating image:", error);
    }
  }, [selectedProject, newImageUrl, updateProjectImage, queryClient, setIsImageDialogOpen, setNewImageUrl, setSelectedProject]);

  const handleSaveEdit = useCallback(async () => {
    if (!selectedProject) return;
    
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
      await updateProject(selectedProject, updatesToSave);
      toast.success("Նախագիծը հաջողությամբ թարմացվեց");
      setIsEditDialogOpen(false);
      setEditedProject({});
      setSelectedProject(null);
      
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    } catch (error) {
      toast.error("Նախագծի թարմացման ընթացքում առաջացավ սխալ");
      console.error("Error updating project:", error);
    }
  }, [selectedProject, editedProject, updateProject, queryClient, setIsEditDialogOpen, setEditedProject, setSelectedProject]);

  const handleProjectCreated = useCallback(async (project: ProjectTheme) => {
    try {
      await createProject(project);
      toast.success("Նախագիծը հաջողությամբ ստեղծվեց");
      setIsCreateDialogOpen(false);
      
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    } catch (error) {
      toast.error("Նախագծի ստեղծման ընթացքում առաջացավ սխալ");
      console.error("Error creating project:", error);
    }
  }, [createProject, queryClient, setIsCreateDialogOpen]);

  return {
    handleDelete,
    handleChangeImage,
    handleSaveEdit,
    handleProjectCreated
  };
};
