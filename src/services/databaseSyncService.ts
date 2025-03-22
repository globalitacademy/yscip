
import { toast } from 'sonner';
import { syncCoursesToSupabase } from '@/components/courses/utils/courseUtils';
import { supabase } from '@/integrations/supabase/client';
import { ProjectTheme } from '@/data/projectThemes';

/**
 * Service for synchronizing local data with Supabase database
 */
export const databaseSyncService = {
  /**
   * Synchronize all local data with the database
   */
  async syncAllData(): Promise<boolean> {
    try {
      toast.info('Տվյալների համաժամեցում...');
      
      // Sync courses
      await syncCoursesToSupabase();
      
      // Sync projects
      await this.syncProjectsToSupabase();
      
      toast.success('Տվյալները հաջողությամբ համաժամեցվել են բազայի հետ');
      return true;
    } catch (error) {
      console.error('Error syncing all data:', error);
      toast.error('Տվյալների համաժամեցման ժամանակ սխալ է տեղի ունեցել');
      return false;
    }
  },
  
  /**
   * Synchronize projects with Supabase
   */
  async syncProjectsToSupabase(): Promise<boolean> {
    try {
      // Load local projects from localStorage
      const localProjects = this.getLocalProjects();
      
      if (localProjects.length === 0) {
        console.log('No local projects to sync');
        return true;
      }
      
      // For each project, check if it exists in Supabase and update/insert as needed
      for (const project of localProjects) {
        // Check if project exists
        const { data: existingProject, error: checkError } = await supabase
          .from('projects')
          .select('id')
          .eq('id', project.id)
          .maybeSingle();
          
        if (checkError) {
          console.error('Error checking project existence:', checkError);
          continue;
        }
        
        if (existingProject) {
          // Update existing project
          const { error: updateError } = await supabase
            .from('projects')
            .update({
              title: project.title,
              description: project.description,
              category: project.category,
              tech_stack: project.techStack,
              image: project.image,
              duration: project.duration,
              updated_at: new Date().toISOString()
            })
            .eq('id', project.id);
            
          if (updateError) {
            console.error('Error updating project:', updateError);
          }
        } else {
          // Insert new project
          const { error: insertError } = await supabase
            .from('projects')
            .insert({
              id: project.id,
              title: project.title,
              description: project.description,
              category: project.category,
              tech_stack: project.techStack,
              image: project.image,
              created_by: project.createdBy,
              duration: project.duration,
              created_at: project.createdAt || new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
            
          if (insertError) {
            console.error('Error inserting project:', insertError);
          }
        }
      }
      
      console.log('Successfully synced projects to Supabase');
      return true;
    } catch (error) {
      console.error('Error syncing projects to Supabase:', error);
      return false;
    }
  },
  
  /**
   * Get projects from localStorage
   */
  getLocalProjects(): ProjectTheme[] {
    try {
      const localProjects = localStorage.getItem('projects');
      if (localProjects) {
        return JSON.parse(localProjects);
      }
      return [];
    } catch (error) {
      console.error('Error getting local projects:', error);
      return [];
    }
  }
};
