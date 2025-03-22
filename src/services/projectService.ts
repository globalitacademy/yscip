
import { supabase } from '@/integrations/supabase/client';
import { ProjectTheme } from '@/data/projectThemes';
import { toast } from 'sonner';

/**
 * Service for handling project-related database operations
 */
export const projectService = {
  /**
   * Format a project from database format to application format
   */
  formatDatabaseProject(dbProject: any): ProjectTheme {
    return {
      id: dbProject.id,
      title: dbProject.title,
      description: dbProject.description,
      image: dbProject.image || `https://source.unsplash.com/random/800x600/?${encodeURIComponent(dbProject.category)}`,
      category: dbProject.category,
      techStack: dbProject.tech_stack || [],
      createdBy: dbProject.created_by,
      createdAt: dbProject.created_at,
      duration: dbProject.duration
    };
  },

  /**
   * Fetch all projects from the database
   */
  async fetchProjects(): Promise<ProjectTheme[]> {
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

      return data.map(project => this.formatDatabaseProject(project));
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('Տվյալների ստացման սխալ');
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
        });
        
      if (error) {
        console.error('Error creating project:', error);
        toast.error('Սխալ նախագծի ստեղծման ժամանակ');
        return false;
      }
      
      toast.success('Նախագիծը հաջողությամբ ստեղծվել է');
      return true;
    } catch (err) {
      console.error('Unexpected error creating project:', err);
      toast.error('Տվյալների բազայի հետ կապի սխալ');
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
          tech_stack: updates.techStack,
          duration: updates.duration,
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
    } catch (err) {
      console.error('Unexpected error updating project:', err);
      toast.error('Տվյալների բազայի հետ կապի սխալ');
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
        toast.error('Սխալ նախագծի նկարի թարմացման ժամանակ');
        return false;
      }
      
      toast.success('Նախագծի նկարը հաջողությամբ թարմացվել է');
      return true;
    } catch (err) {
      console.error('Unexpected error updating project image:', err);
      toast.error('Տվյալների բազայի հետ կապի սխալ');
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
        toast.error('Սխալ նախագծի ջնջման ժամանակ');
        return false;
      }
      
      toast.success('Նախագիծը հաջողությամբ ջնջվել է');
      return true;
    } catch (err) {
      console.error('Unexpected error deleting project:', err);
      toast.error('Տվյալների բազայի հետ կապի սխալ');
      return false;
    }
  }
};
