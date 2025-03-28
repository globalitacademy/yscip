import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProjectTheme } from '@/data/projectThemes';
import { toast } from 'sonner';

/**
 * Hook for handling all project-related database operations
 */
export const useProjectService = () => {
  const [loading, setLoading] = useState(false);

  /**
   * Fetch all projects from the database
   */
  const fetchProjects = async (): Promise<ProjectTheme[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching projects:', error);
        toast.error('Սխալ նախագծերի ստացման ժամանակ');
        return [];
      }
      
      if (!data || data.length === 0) {
        return [];
      }
      
      // Map database results to ProjectTheme objects
      return data.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        image: project.image || `https://source.unsplash.com/random/800x600/?${encodeURIComponent(project.category)}`,
        category: project.category,
        techStack: project.tech_stack || [],
        createdBy: project.created_by,
        createdAt: project.created_at,
        updatedAt: project.updated_at || project.created_at,
        duration: project.duration,
        complexity: 'Միջին',
        is_public: project.is_public || false,
        detailedDescription: '',
        steps: [],
        prerequisites: [],
        learningOutcomes: []
      }));
    } catch (error) {
      console.error('Error in fetchProjects:', error);
      toast.error('Սխալ է տեղի ունեցել նախագծերի տվյալները բեռնելիս։');
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new project in the database
   */
  const createProject = async (project: Partial<ProjectTheme>, userId: string | undefined): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('projects')
        .insert({
          title: project.title,
          description: project.description,
          category: project.category,
          tech_stack: project.techStack,
          image: project.image,
          created_by: userId,
          duration: project.duration,
          is_public: project.is_public || false,
          complexity: project.complexity,
          detailed_description: project.detailedDescription,
          steps: project.steps,
          prerequisites: project.prerequisites,
          learning_outcomes: project.learningOutcomes
        });
        
      if (error) {
        console.error('Error creating project:', error);
        toast.error('Սխալ նախագծի ստեղծման ժամանակ');
        return false;
      }
      
      toast.success('Նախագիծը հաջողությամբ ստեղծվել է');
      return true;
    } catch (error) {
      console.error('Error in createProject:', error);
      toast.error('Սխալ է տեղի ունեցել նախագիծ ստեղծելիս։');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update a project in the database
   */
  const updateProject = async (projectId: number, updates: Partial<ProjectTheme>): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          title: updates.title,
          description: updates.description,
          category: updates.category,
          is_public: updates.is_public,
          duration: updates.duration,
          tech_stack: updates.techStack,
          complexity: updates.complexity,
          detailed_description: updates.detailedDescription,
          steps: updates.steps,
          prerequisites: updates.prerequisites,
          learning_outcomes: updates.learningOutcomes,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);
        
      if (error) {
        console.error('Error updating project:', error);
        toast.error('Սխալ նախագծի թարմացման ժամանակ');
        return false;
      }
      
      toast.success('Նախագիծը հաջողությամբ թարմացվել է');
      return true;
    } catch (error) {
      console.error('Error in updateProject:', error);
      toast.error('Սխալ է տեղի ունեցել նախագիծը թարմացնելիս։');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update a project's image in the database
   */
  const updateProjectImage = async (projectId: number, imageUrl: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('projects')
        .update({ image: imageUrl })
        .eq('id', projectId);
        
      if (error) {
        console.error('Error updating project image:', error);
        toast.error('Սխալ նախագծի նկարի թարմացման ժամանակ');
        return false;
      }
      
      toast.success('Նախագծի նկարը հաջողությամբ թարմացվել է');
      return true;
    } catch (error) {
      console.error('Error in updateProjectImage:', error);
      toast.error('Սխալ է տեղի ունեցել նախագծի նկարը թարմացնելիս։');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a project from the database
   */
  const deleteProject = async (projectId: number): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
        
      if (error) {
        console.error('Error deleting project:', error);
        toast.error('Սխալ նախագծի ջնջման ժամանակ');
        return false;
      }
      
      toast.success('Նախագիծը հաջողությամբ ջնջվել է');
      return true;
    } catch (error) {
      console.error('Error in deleteProject:', error);
      toast.error('Սխալ է տեղի ունեցել նախագիծը ջնջելիս։');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchProjects,
    createProject,
    updateProject,
    updateProjectImage,
    deleteProject,
    loading
  };
};
