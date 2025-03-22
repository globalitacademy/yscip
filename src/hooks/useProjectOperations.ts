
import { useState, useEffect } from 'react';
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

  // Add event listener for reloading projects from localStorage
  useEffect(() => {
    const handleReloadFromLocal = () => {
      loadProjectsFromLocalStorage();
    };

    window.addEventListener('reload-projects-from-local', handleReloadFromLocal);

    return () => {
      window.removeEventListener('reload-projects-from-local', handleReloadFromLocal);
    };
  }, []);

  /**
   * Load all projects from the database
   */
  const loadProjects = async () => {
    setIsLoading(true);
    try {
      // First try to load from localStorage
      await loadProjectsFromLocalStorage();
      
      // Then try to load from the database
      const fetchedProjects = await projectService.fetchProjects();
      if (fetchedProjects && fetchedProjects.length > 0) {
        setProjects(fetchedProjects);
        // Update localStorage with fetched projects
        localStorage.setItem('projects', JSON.stringify(fetchedProjects));
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Load projects from localStorage
   */
  const loadProjectsFromLocalStorage = async () => {
    try {
      const localProjects = localStorage.getItem('projects');
      if (localProjects) {
        const parsedProjects = JSON.parse(localProjects);
        if (parsedProjects && parsedProjects.length > 0) {
          console.log('Loaded projects from localStorage:', parsedProjects.length);
          setProjects(parsedProjects);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error loading projects from localStorage:', error);
      return false;
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
    
    // Also update localStorage
    const updatedProjects = [project, ...projects];
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    
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
    const updatedProjects = projects.map(p => 
      p.id === selectedProject.id ? { ...p, ...updatedData } : p
    );
    setProjects(updatedProjects);
    
    // Also update localStorage
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    
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
    const updatedProjects = projects.map(p => 
      p.id === selectedProject.id ? { ...p, image: newImageUrl } : p
    );
    setProjects(updatedProjects);
    
    // Also update localStorage
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    
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
    const updatedProjects = projects.filter(p => p.id !== selectedProject.id);
    setProjects(updatedProjects);
    
    // Also update localStorage
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    
    return false;
  };

  return {
    projects,
    setProjects,
    isLoading,
    loadProjects,
    loadProjectsFromLocalStorage,
    createProject,
    updateProject,
    updateProjectImage,
    deleteProject
  };
};
