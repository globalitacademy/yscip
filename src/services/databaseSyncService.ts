
import { toast } from 'sonner';
import { syncCoursesToSupabase } from '@/components/courses/utils/courseUtils';
import { supabase } from '@/integrations/supabase/client';
import { ProjectTheme } from '@/data/projectThemes';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';

/**
 * Type for the progress callback function
 */
type ProgressCallback = (status: string) => void;

/**
 * Service for synchronizing local data with Supabase database
 */
export const databaseSyncService = {
  /**
   * Load data from localStorage
   * @param progressCallback Optional callback for progress updates
   */
  async loadDataFromLocalStorage(progressCallback?: ProgressCallback): Promise<boolean> {
    try {
      progressCallback?.('Տվյալների բեռնում լոկալ հիշողությունից...');
      
      // Trigger custom events to notify components to reload data from localStorage
      window.dispatchEvent(new CustomEvent('reload-courses-from-local'));
      window.dispatchEvent(new CustomEvent('reload-projects-from-local'));
      
      progressCallback?.('Տվյալները հաջողությամբ բեռնվել են լոկալ հիշողությունից');
      return true;
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      progressCallback?.('Սխալ տվյալների բեռնման ժամանակ');
      return false;
    }
  },
  
  /**
   * Synchronize all local data with the database
   * @param progressCallback Optional callback for progress updates
   */
  async syncAllData(progressCallback?: ProgressCallback): Promise<boolean> {
    try {
      progressCallback?.('Նախապատրաստում համաժամեցման համար...');
      
      // Sync courses
      progressCallback?.('Դասընթացների համաժամեցում...');
      try {
        await syncCoursesToSupabase();
        progressCallback?.('Դասընթացները հաջողությամբ համաժամեցվել են');
      } catch (courseError) {
        console.error('Error syncing courses:', courseError);
        progressCallback?.('Դասընթացների համաժամեցման ժամանակ սխալ է տեղի ունեցել');
        // Continue with projects sync despite course sync error
      }
      
      // Sync projects
      progressCallback?.('Նախագծերի համաժամեցում...');
      try {
        await this.syncProjectsToSupabase(progressCallback);
        progressCallback?.('Նախագծերը հաջողությամբ համաժամեցվել են');
      } catch (projectError) {
        console.error('Error syncing projects:', projectError);
        progressCallback?.('Նախագծերի համաժամեցման ժամանակ սխալ է տեղի ունեցել');
      }
      
      progressCallback?.('Համաժամեցումը ավարտված է');
      return true;
    } catch (error) {
      console.error('Error syncing all data:', error);
      progressCallback?.('Սխալ համաժամեցման ժամանակ');
      return false;
    }
  },
  
  /**
   * Synchronize projects with Supabase
   * @param progressCallback Optional callback for progress updates
   */
  async syncProjectsToSupabase(progressCallback?: ProgressCallback): Promise<boolean> {
    try {
      // Load local projects from localStorage
      progressCallback?.('Նախագծերի տվյալների ստացում...');
      const localProjects = this.getLocalProjects();
      
      if (localProjects.length === 0) {
        console.log('No local projects to sync');
        progressCallback?.('Համաժամեցման ենթակա նախագծեր չկան');
        return true;
      }
      
      progressCallback?.(`Համաժամեցվում են ${localProjects.length} նախագծեր...`);
      
      let updatedCount = 0;
      let insertedCount = 0;
      
      for (const project of localProjects) {
        try {
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
            progressCallback?.(`Թարմացվում է նախագիծը (${updatedCount + 1}/${localProjects.length})...`);
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
            } else {
              updatedCount++;
            }
          } else {
            // Insert new project
            progressCallback?.(`Ավելացվում է նոր նախագիծ (${insertedCount + 1}/${localProjects.length})...`);
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
            } else {
              insertedCount++;
            }
          }
        } catch (projectError) {
          console.error('Error processing project:', projectError);
          // Continue with next project despite error
        }
      }
      
      progressCallback?.(`Հաջողությամբ համաժամեցվել է ${updatedCount + insertedCount}/${localProjects.length} նախագիծ`);
      console.log(`Successfully synced projects to Supabase: ${updatedCount} updated, ${insertedCount} inserted`);
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
