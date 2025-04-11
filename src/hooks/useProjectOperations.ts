
import { useCallback, useState } from 'react';
import { ProjectTheme } from '@/data/projectThemes';
import { useQueryClient } from '@tanstack/react-query';
import * as projectService from '@/services/projectService';

/**
 * Hook for handling project operations like initializing edit, image change, and delete
 */
export const useProjectOperations = () => {
  const queryClient = useQueryClient();
  const [projects, setProjects] = useState<ProjectTheme[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      // Assuming there's a fetchProjects function in projectService
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProject = useCallback(async (project: ProjectTheme, updates: Partial<ProjectTheme>): Promise<boolean> => {
    try {
      const updated = await projectService.updateProject(project.id, updates);
      if (updated) {
        // Update local state
        setProjects(prev => 
          prev.map(p => p.id === project.id ? { ...p, ...updates } : p)
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating project:', error);
      return false;
    }
  }, []);

  const updateProjectImage = useCallback(async (project: ProjectTheme, imageUrl: string): Promise<boolean> => {
    try {
      const updated = await projectService.updateProject(project.id, { image: imageUrl });
      if (updated) {
        // Update local state
        setProjects(prev => 
          prev.map(p => p.id === project.id ? { ...p, image: imageUrl } : p)
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating project image:', error);
      return false;
    }
  }, []);

  const deleteProject = useCallback(async (project: ProjectTheme): Promise<boolean> => {
    try {
      const success = await projectService.deleteProject(project.id);
      if (success) {
        // Update local state
        setProjects(prev => prev.filter(p => p.id !== project.id));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  }, []);

  const createProject = useCallback(async (project: ProjectTheme): Promise<boolean> => {
    try {
      const newProject = await projectService.createProject(project);
      if (newProject) {
        // Update local state
        setProjects(prev => [...prev, newProject]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating project:', error);
      return false;
    }
  }, []);

  const handleEditInit = useCallback((project: ProjectTheme) => {
    // Implementation for handling edit initialization
  }, []);

  const handleImageChangeInit = useCallback((project: ProjectTheme) => {
    // Implementation for handling image change initialization
  }, []);

  const handleDeleteInit = useCallback((project: ProjectTheme) => {
    // Implementation for handling delete initialization
  }, []);

  const handleOpenCreateDialog = useCallback(() => {
    // Implementation for handling create dialog opening
  }, []);

  return {
    projects,
    setProjects,
    isLoading,
    loadProjects,
    updateProject,
    updateProjectImage,
    deleteProject,
    createProject,
    handleEditInit,
    handleImageChangeInit, 
    handleDeleteInit,
    handleOpenCreateDialog
  };
};
