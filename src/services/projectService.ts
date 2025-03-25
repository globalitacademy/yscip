
import { supabase } from '@/integrations/supabase/client';
import { ProjectTheme } from '@/data/projectThemes';
import { toast } from 'sonner';

/**
 * Service for handling project-related database operations
 */
export const projectService = {
  /**
   * Fetch all projects from the database
   */
  async fetchProjects(): Promise<ProjectTheme[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false }); // Order by creation date for better UX
      
      if (error) {
        console.error('Error fetching projects:', error);
        toast('Սխալ նախագծերի ստացման ժամանակ');
        throw error;
      }

      if (!data || data.length === 0) {
        console.log('No projects found in database');
        // Try to load from localStorage as fallback
        const localProjects = localStorage.getItem('projects');
        if (localProjects) {
          return JSON.parse(localProjects);
        }
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
        duration: project.duration,
        complexity: 'Միջին', // Default complexity
        is_public: project.is_public
      }));
    } catch (err) {
      console.error('Unexpected error:', err);
      toast('Տվյալների ստացման սխալ, օգտագործվում են լոկալ տվյալները');
      
      // Try to load from localStorage as fallback
      const localProjects = localStorage.getItem('projects');
      if (localProjects) {
        return JSON.parse(localProjects);
      }
      return [];
    }
  },

  /**
   * Create a new project in the database
   */
  async createProject(project: Partial<ProjectTheme>, userId: string | undefined): Promise<boolean> {
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
          is_public: project.is_public || false
        });
        
      if (error) {
        console.error('Error creating project:', error);
        toast('Սխալ նախագծի ստեղծման ժամանակ');
        return false;
      }
      
      toast('Նախագիծը հաջողությամբ ստեղծվել է');
      return true;
    } catch (err) {
      console.error('Unexpected error creating project:', err);
      toast('Տվյալների բազայի հետ կապի սխալ, նախագիծը ստեղծվել է լոկալ');
      return false;
    }
  },

  /**
   * Update a project in the database
   */
  async updateProject(projectId: number, updates: Partial<ProjectTheme>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          title: updates.title,
          description: updates.description,
          category: updates.category,
          is_public: updates.is_public,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);
        
      if (error) {
        console.error('Error updating project:', error);
        toast('Սխալ նախագծի թարմացման ժամանակ');
        return false;
      }
      
      toast('Նախագիծը հաջողությամբ թարմացվել է');
      return true;
    } catch (err) {
      console.error('Unexpected error updating project:', err);
      toast('Տվյալների բազայի հետ կապի սխալ, նախագիծը թարմացվել է լոկալ');
      return false;
    }
  },

  /**
   * Update a project's image in the database
   */
  async updateProjectImage(projectId: number, imageUrl: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ image: imageUrl })
        .eq('id', projectId);
        
      if (error) {
        console.error('Error updating project image:', error);
        toast('Սխալ նախագծի նկարի թարմացման ժամանակ');
        return false;
      }
      
      toast('Նախագծի նկարը հաջողությամբ թարմացվել է');
      return true;
    } catch (err) {
      console.error('Unexpected error updating project image:', err);
      toast('Տվյալների բազայի հետ կապի սխալ, նախագիծը նկարը թարմացվել է լոկալ');
      return false;
    }
  },

  /**
   * Delete a project from the database
   */
  async deleteProject(projectId: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
        
      if (error) {
        console.error('Error deleting project:', error);
        toast('Սխալ նախագծի ջնջման ժամանակ');
        return false;
      }
      
      toast('Նախագիծը հաջողությամբ ջնջվել է');
      return true;
    } catch (err) {
      console.error('Unexpected error deleting project:', err);
      toast('Տվյալների բազայի հետ կապի սխալ, նախագիծը ջնջվել է լոկալ');
      return false;
    }
  }
};
