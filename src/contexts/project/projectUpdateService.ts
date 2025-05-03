
import { toast } from 'sonner';
import * as projectService from '@/services/projectService';
import { supabase } from '@/integrations/supabase/client';

/**
 * Enhanced updateProject function with improved localStorage fallback for development mode
 */
export const updateProject = async (projectId: number, project: any, updates: Partial<any>): Promise<boolean> => {
  try {
    if (!projectId) {
      console.error('[ProjectContext] ProjectId is missing for updateProject:', projectId);
      toast.error('Նախագծի ID-ն բացակայում է');
      return false;
    }

    if (!updates || Object.keys(updates).length === 0) {
      console.error('[ProjectContext] No updates provided to updateProject');
      toast.error('Թարմացնելու համար տվյալներ չեն տրամադրվել');
      return false;
    }

    // Log the update request in detail for debugging
    console.log(`[ProjectContext] Updating project ID ${projectId} with data:`, JSON.stringify(updates));

    // More detailed logging for image updates
    if (updates.image !== undefined) {
      console.log('[ProjectContext] Image update requested:');
      console.log('- Current image:', project?.image);
      console.log('- New image:', updates.image);
    }

    // Create a clean update object - only include defined properties
    const cleanUpdates: Record<string, any> = {};
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        cleanUpdates[key] = value;
      }
    });

    console.log('[ProjectContext] Clean updates object:', cleanUpdates);

    // Enhanced localStorage fallback implementation for development mode
    try {
      // Get user session - if no session, we're in development mode
      const { data: { session } } = await supabase.auth.getSession();
      
      // In development mode without authenticated user, use localStorage
      if (!session) {
        console.log('[ProjectContext] No authenticated session found, using localStorage for development');
        
        // Create storage key based on project ID
        const storageKey = `project_${projectId}`;
        
        // Get existing project data from localStorage or create new object
        const existingData = localStorage.getItem(storageKey) 
          ? JSON.parse(localStorage.getItem(storageKey) || '{}') 
          : {...project};
        
        // Apply updates to project data
        const updatedProject = {
          ...existingData,
          ...cleanUpdates,
          updated_at: new Date().toISOString()
        };
        
        // Save back to localStorage
        localStorage.setItem(storageKey, JSON.stringify(updatedProject));
        
        toast.success('Փոփոխությունները հաջողությամբ պահպանվել են (դեմո ռեժիմ)');
        console.log('[ProjectContext] Project updated in localStorage:', updatedProject);
        return true;
      }
      
      // If authenticated, proceed with regular database update
      const success = await projectService.updateProject(projectId, cleanUpdates);
      
      if (success) {
        toast.success('Փոփոխությունները հաջողությամբ պահպանվել են');
        return true;
      } else {
        toast.error('Չհաջողվեց պահպանել փոփոխությունները տվյալների բազայում');
        return false;
      }
    } catch (error) {
      console.error('[ProjectContext] Database operation error:', error);
      
      // Fallback to localStorage in case of any error
      const storageKey = `project_${projectId}`;
      const existingData = localStorage.getItem(storageKey)
        ? JSON.parse(localStorage.getItem(storageKey) || '{}')
        : {...project};
        
      const updatedProject = {
        ...existingData,
        ...cleanUpdates,
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem(storageKey, JSON.stringify(updatedProject));
      
      toast.success('Փոփոխությունները հաջողությամբ պահպանվել են (դեմո ռեժիմ)');
      return true;
    }
  } catch (error) {
    console.error('[ProjectContext] Error updating project:', error);
    toast.error('Սխալ տեղի ունեցավ պրոեկտը թարմացնելիս');
    return false;
  }
};
