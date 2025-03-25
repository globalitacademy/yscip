
import { useState, useEffect, useCallback } from 'react';
import { ProjectTheme } from '@/data/projectThemes';
import { projectService } from '@/services/projectService';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Hook to handle project CRUD operations with React Query for caching
 */
export const useProjectOperations = () => {
  const [projects, setProjects] = useState<ProjectTheme[]>([]);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Use React Query for data fetching with caching
  const { isLoading, data: fetchedProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: projectService.fetchProjects,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Update local state when query data changes
  useEffect(() => {
    if (fetchedProjects && fetchedProjects.length > 0) {
      setProjects(fetchedProjects);
      // Update localStorage with fetched projects
      localStorage.setItem('projects', JSON.stringify(fetchedProjects));
    } else {
      // If no data from query, try to load from localStorage
      loadProjectsFromLocalStorage();
    }
  }, [fetchedProjects]);

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
   * Load projects from localStorage
   */
  const loadProjectsFromLocalStorage = useCallback(async () => {
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
    }
  }, []);

  /**
   * Load all projects from the database or localStorage
   */
  const loadProjects = useCallback(async () => {
    // First try to load from localStorage
    await loadProjectsFromLocalStorage();
    
    // Then refresh from the database by invalidating the query
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  }, [loadProjectsFromLocalStorage, queryClient]);

  // Create mutation for project creation
  const createProjectMutation = useMutation({
    mutationFn: async (project: ProjectTheme) => 
      projectService.createProject(project, user?.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error) => {
      console.error('Error creating project:', error);
    }
  });

  // Create mutation for project updates
  const updateProjectMutation = useMutation({
    mutationFn: async ({ projectId, updates }: { projectId: number, updates: Partial<ProjectTheme> }) => 
      projectService.updateProject(projectId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error) => {
      console.error('Error updating project:', error);
    }
  });

  // Create mutation for project image updates
  const updateProjectImageMutation = useMutation({
    mutationFn: async ({ projectId, imageUrl }: { projectId: number, imageUrl: string }) => 
      projectService.updateProjectImage(projectId, imageUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error) => {
      console.error('Error updating project image:', error);
    }
  });

  // Create mutation for project deletion
  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: number) => 
      projectService.deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error) => {
      console.error('Error deleting project:', error);
    }
  });

  /**
   * Create a new project
   */
  const createProject = useCallback(async (project: ProjectTheme) => {
    const success = await createProjectMutation.mutateAsync(project);
    
    if (!success) {
      // If the database operation fails, update the local state
      setProjects(prev => [project, ...prev]);
      
      // Also update localStorage
      const updatedProjects = [project, ...projects];
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
    }
    
    return success;
  }, [createProjectMutation, projects]);

  /**
   * Update a project
   */
  const updateProject = useCallback(async (selectedProject: ProjectTheme, updatedData: Partial<ProjectTheme>) => {
    const success = await updateProjectMutation.mutateAsync({ 
      projectId: selectedProject.id, 
      updates: updatedData 
    });
    
    if (!success) {
      // If the database operation fails, update the local state
      const updatedProjects = projects.map(p => 
        p.id === selectedProject.id ? { ...p, ...updatedData } : p
      );
      setProjects(updatedProjects);
      
      // Also update localStorage
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
    }
    
    return success;
  }, [updateProjectMutation, projects]);

  /**
   * Update a project's image
   */
  const updateProjectImage = useCallback(async (selectedProject: ProjectTheme, newImageUrl: string) => {
    const success = await updateProjectImageMutation.mutateAsync({ 
      projectId: selectedProject.id, 
      imageUrl: newImageUrl 
    });
    
    if (!success) {
      // If the database operation fails, update the local state
      const updatedProjects = projects.map(p => 
        p.id === selectedProject.id ? { ...p, image: newImageUrl } : p
      );
      setProjects(updatedProjects);
      
      // Also update localStorage
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
    }
    
    return success;
  }, [updateProjectImageMutation, projects]);

  /**
   * Delete a project
   */
  const deleteProject = useCallback(async (selectedProject: ProjectTheme) => {
    const success = await deleteProjectMutation.mutateAsync(selectedProject.id);
    
    if (!success) {
      // If the database operation fails, update the local state
      const updatedProjects = projects.filter(p => p.id !== selectedProject.id);
      setProjects(updatedProjects);
      
      // Also update localStorage
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
    }
    
    return success;
  }, [deleteProjectMutation, projects]);

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
