
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
    }
  }, [fetchedProjects]);

  // Add event listener for reloading projects from database
  useEffect(() => {
    const handleReloadFromDatabase = () => {
      // Invalidate the query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    };

    window.addEventListener('reload-projects-from-database', handleReloadFromDatabase);

    return () => {
      window.removeEventListener('reload-projects-from-database', handleReloadFromDatabase);
    };
  }, [queryClient]);

  /**
   * Load all projects from the database
   */
  const loadProjects = useCallback(async () => {
    // Refresh from the database by invalidating the query
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  }, [queryClient]);

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
    // Attempt to create the project in the database
    const success = await createProjectMutation.mutateAsync(project);
    
    if (success) {
      // If successful, React Query will automatically refetch the projects
      return true;
    } else {
      // If the database operation fails, inform the user
      console.error('Failed to create project in the database');
      return false;
    }
  }, [createProjectMutation]);

  /**
   * Update a project
   */
  const updateProject = useCallback(async (selectedProject: ProjectTheme, updatedData: Partial<ProjectTheme>) => {
    // Create a complete data object with all fields
    const updatePayload = {
      title: updatedData.title,
      description: updatedData.description,
      category: updatedData.category,
      is_public: updatedData.is_public,
      complexity: updatedData.complexity,
      duration: updatedData.duration,
      tech_stack: updatedData.techStack,
      detailed_description: updatedData.detailedDescription,
      steps: updatedData.steps,
      prerequisites: updatedData.prerequisites,
      learning_outcomes: updatedData.learningOutcomes,
      updated_at: new Date().toISOString()
    };
    
    // Attempt to update the project in the database
    const success = await updateProjectMutation.mutateAsync({ 
      projectId: selectedProject.id, 
      updates: updatePayload
    });
    
    return success;
  }, [updateProjectMutation]);

  /**
   * Update a project's image
   */
  const updateProjectImage = useCallback(async (selectedProject: ProjectTheme, newImageUrl: string) => {
    // Attempt to update the project image in the database
    const success = await updateProjectImageMutation.mutateAsync({ 
      projectId: selectedProject.id, 
      imageUrl: newImageUrl 
    });
    
    return success;
  }, [updateProjectImageMutation]);

  /**
   * Delete a project
   */
  const deleteProject = useCallback(async (selectedProject: ProjectTheme) => {
    // Attempt to delete the project from the database
    const success = await deleteProjectMutation.mutateAsync(selectedProject.id);
    
    return success;
  }, [deleteProjectMutation]);

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
