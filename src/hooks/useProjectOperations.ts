
import { useState } from 'react';
import { ProjectTheme } from '@/data/projectThemes';
import { projectService } from '@/services/projectService';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to handle project CRUD operations
 */
export const useProjectOperations = () => {
  const [projects, setProjects] = useState<ProjectTheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  /**
   * Load all projects from the database
   */
  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const fetchedProjects = await projectService.fetchProjects();
      setProjects(fetchedProjects);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Create a new project
   */
  const createProject = async (project: ProjectTheme) => {
    const success = await projectService.createProject(project, user?.id);
    if (success) {
      // We don't need to manually update the state here as the real-time subscription 
      // in useProjectEvents will handle this
      return true;
    }
    
    // If the database operation fails, update the local state
    setProjects(prev => [project, ...prev]);
    return false;
  };

  /**
   * Update a project
   */
  const updateProject = async (selectedProject: ProjectTheme, updatedData: Partial<ProjectTheme>) => {
    const success = await projectService.updateProject(selectedProject.id, updatedData);
    if (success) {
      // We don't need to manually update the state here as the real-time subscription
      // in useProjectEvents will handle this
      return true;
    }
    
    // If the database operation fails, update the local state
    setProjects(prev => prev.map(p => 
      p.id === selectedProject.id ? { ...p, ...updatedData } : p
    ));
    return false;
  };

  /**
   * Update a project's image
   */
  const updateProjectImage = async (selectedProject: ProjectTheme, newImageUrl: string) => {
    const success = await projectService.updateProjectImage(selectedProject.id, newImageUrl);
    if (success) {
      // We don't need to manually update the state here as the real-time subscription
      // in useProjectEvents will handle this
      return true;
    }
    
    // If the database operation fails, update the local state
    setProjects(prev => prev.map(p => 
      p.id === selectedProject.id ? { ...p, image: newImageUrl } : p
    ));
    return false;
  };

  /**
   * Delete a project
   */
  const deleteProject = async (selectedProject: ProjectTheme) => {
    const success = await projectService.deleteProject(selectedProject.id);
    if (success) {
      // We don't need to manually update the state here as the real-time subscription
      // in useProjectEvents will handle this
      return true;
    }
    
    // If the database operation fails, update the local state
    setProjects(prev => prev.filter(p => p.id !== selectedProject.id));
    return false;
  };

  return {
    projects,
    setProjects,
    isLoading,
    loadProjects,
    createProject,
    updateProject,
    updateProjectImage,
    deleteProject
  };
};
