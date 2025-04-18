
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProjectTheme } from '@/data/projectThemes';
import { toast } from 'sonner';

/**
 * A custom hook that subscribes to real-time project changes
 * and updates the projects state accordingly
 */
export const useProjectEvents = (
  setProjects: React.Dispatch<React.SetStateAction<ProjectTheme[]>>
) => {
  useEffect(() => {
    // Enable real-time updates for the projects table
    const projectsSubscription = supabase
      .channel('projects-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        (payload) => {
          console.log('Real-time update received:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newProject = payload.new as any;
            setProjects(prevProjects => {
              const projectToAdd: ProjectTheme = {
                id: newProject.id,
                title: newProject.title,
                description: newProject.description,
                image: newProject.image || `https://source.unsplash.com/random/800x600/?${encodeURIComponent(newProject.category)}`,
                category: newProject.category,
                techStack: newProject.tech_stack || [],
                createdBy: newProject.created_by || 'system',
                createdAt: newProject.created_at || new Date().toISOString(),
                updatedAt: newProject.updated_at || newProject.created_at || new Date().toISOString(),
                duration: newProject.duration || 'Չսահմանված', // Default value
                complexity: 'Միջին', // Default complexity
                steps: [] // Initialize empty steps
              };
              
              if (!prevProjects.some(p => p.id === projectToAdd.id)) {
                toast(`Նոր նախագիծ: ${projectToAdd.title}`);
                return [projectToAdd, ...prevProjects];
              }
              return prevProjects;
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedProject = payload.new as any;
            setProjects(prevProjects => 
              prevProjects.map(project => {
                if (project.id === updatedProject.id) {
                  return {
                    ...project,
                    title: updatedProject.title,
                    description: updatedProject.description,
                    image: updatedProject.image || project.image,
                    category: updatedProject.category,
                    techStack: updatedProject.tech_stack || [],
                    duration: updatedProject.duration || project.duration || 'Չսահմանված',
                    updatedAt: updatedProject.updated_at || new Date().toISOString()
                  };
                }
                return project;
              })
            );
            toast(`Նախագիծը թարմացվել է: ${updatedProject.title}`);
          } else if (payload.eventType === 'DELETE') {
            const deletedProject = payload.old as any;
            setProjects(prevProjects => 
              prevProjects.filter(project => project.id !== deletedProject.id)
            );
            toast(`Նախագիծը ջնջվել է: ${deletedProject.title}`);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(projectsSubscription);
    };
  }, [setProjects]);
};
