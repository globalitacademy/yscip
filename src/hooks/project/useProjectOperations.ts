
import { useCallback } from 'react';
import { ProjectTheme } from '@/data/projectThemes';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Hook for handling project operations like initializing edit, image change, and delete
 */
export const useProjectOperations = (
  setSelectedProject: (project: ProjectTheme | null) => void,
  setEditedProject: (project: Partial<ProjectTheme>) => void,
  setIsEditDialogOpen: (isOpen: boolean) => void,
  setNewImageUrl: (url: string) => void,
  setIsImageDialogOpen: (isOpen: boolean) => void,
  setIsDeleteDialogOpen: (isOpen: boolean) => void,
  setIsCreateDialogOpen: (isOpen: boolean) => void
) => {
  const queryClient = useQueryClient();

  const handleEditInit = useCallback((project: ProjectTheme) => {
    setSelectedProject(project);
    setEditedProject({
      title: project.title,
      description: project.description,
      category: project.category,
      complexity: project.complexity || 'Միջին',
      duration: project.duration || '',
      techStack: project.techStack || [],
      steps: project.steps || [],
      prerequisites: project.prerequisites || [],
      learningOutcomes: project.learningOutcomes || [],
      detailedDescription: project.detailedDescription || ''
    });
    setIsEditDialogOpen(true);
  }, [setSelectedProject, setEditedProject, setIsEditDialogOpen]);

  const handleImageChangeInit = useCallback((project: ProjectTheme) => {
    setSelectedProject(project);
    setNewImageUrl(project.image || '');
    setIsImageDialogOpen(true);
  }, [setSelectedProject, setNewImageUrl, setIsImageDialogOpen]);

  const handleDeleteInit = useCallback((project: ProjectTheme) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  }, [setSelectedProject, setIsDeleteDialogOpen]);

  const handleOpenCreateDialog = useCallback(() => {
    setIsCreateDialogOpen(true);
  }, [setIsCreateDialogOpen]);

  return {
    handleEditInit,
    handleImageChangeInit,
    handleDeleteInit,
    handleOpenCreateDialog
  };
};
