
import { useState, useEffect } from 'react';
import { ProjectTheme } from '@/data/projectThemes';
import { projectService } from '@/services/projectService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to handle project CRUD operations with real-time updates
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
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Նախագծերի բեռնման ժամանակ սխալ է տեղի ունեցել');
    } finally {
      setIsLoading(false);
    }
  };

  // Subscribe to real-time project updates
  useEffect(() => {
    const channel = supabase
      .channel('public:projects')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        (payload) => {
          console.log('Project real-time update:', payload);
          
          if (payload.eventType === 'INSERT') {
            // Add new project to state
            const newProject = projectService.formatDatabaseProject(payload.new);
            setProjects(prev => [newProject, ...prev]);
            toast.success(`Նոր նախագիծ՝ ${newProject.title}`);
          } 
          else if (payload.eventType === 'UPDATE') {
            // Update existing project in state
            const updatedProject = projectService.formatDatabaseProject(payload.new);
            setProjects(prev => prev.map(p => 
              p.id === updatedProject.id ? updatedProject : p
            ));
            toast.info(`Նախագիծը թարմացվել է՝ ${updatedProject.title}`);
          }
          else if (payload.eventType === 'DELETE') {
            // Remove deleted project from state
            const deletedId = payload.old.id;
            setProjects(prev => prev.filter(p => p.id !== deletedId));
            toast.info('Նախագիծը ջնջվել է');
          }
        }
      )
      .subscribe();
    
    // Load initial data
    loadProjects();
    
    // Cleanup
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  /**
   * Create a new project
   */
  const createProject = async (project: ProjectTheme) => {
    setIsLoading(true);
    try {
      const success = await projectService.createProject(project, user?.id);
      if (!success) {
        toast.error('Նախագծի ստեղծման ժամանակ սխալ է տեղի ունեցել');
      }
      return success;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update a project
   */
  const updateProject = async (selectedProject: ProjectTheme, updatedData: Partial<ProjectTheme>) => {
    setIsLoading(true);
    try {
      const success = await projectService.updateProject(selectedProject.id, updatedData);
      if (!success) {
        toast.error('Նախագծի թարմացման ժամանակ սխալ է տեղի ունեցել');
      }
      return success;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update a project's image
   */
  const updateProjectImage = async (selectedProject: ProjectTheme, newImageUrl: string) => {
    setIsLoading(true);
    try {
      const success = await projectService.updateProjectImage(selectedProject.id, newImageUrl);
      if (!success) {
        toast.error('Նախագծի նկարի թարմացման ժամանակ սխալ է տեղի ունեցել');
      }
      return success;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete a project
   */
  const deleteProject = async (selectedProject: ProjectTheme) => {
    setIsLoading(true);
    try {
      const success = await projectService.deleteProject(selectedProject.id);
      if (!success) {
        toast.error('Նախագծի ջնջման ժամանակ սխալ է տեղի ունեցել');
      }
      return success;
    } finally {
      setIsLoading(false);
    }
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
