
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

/**
 * Type for the progress callback function
 */
type ProgressCallback = (status: string) => void;

/**
 * Service for synchronizing data with Supabase database
 */
export const databaseSyncService = {
  /**
   * Synchronize all data with the database
   * @param progressCallback Optional callback for progress updates
   */
  async syncAllData(progressCallback?: ProgressCallback): Promise<boolean> {
    try {
      progressCallback?.('Նախապատրաստում համաժամեցման համար...');
      
      // Trigger data reload from database
      progressCallback?.('Դասընթացների համաժամեցում...');
      try {
        window.dispatchEvent(new CustomEvent('reload-courses-from-database'));
        progressCallback?.('Դասընթացները հաջողությամբ համաժամեցվել են');
      } catch (courseError) {
        console.error('Error syncing courses:', courseError);
        progressCallback?.('Դասընթացների համաժամեցման ժամանակ սխալ է տեղի ունեցել');
      }
      
      // Sync projects
      progressCallback?.('Նախագծերի համաժամեցում...');
      try {
        window.dispatchEvent(new CustomEvent('reload-projects-from-database'));
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
  }
};
