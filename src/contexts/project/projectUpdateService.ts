
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Updates a project's data in the database
 * @param projectId The ID of the project to update
 * @param currentProject The current project data
 * @param updates The updates to apply to the project
 * @returns True if the update was successful, false otherwise
 */
export const updateProject = async (
  projectId: number, 
  currentProject: any, 
  updates: Partial<any>
): Promise<boolean> => {
  try {
    console.log('Updating project with ID:', projectId);
    console.log('Updates:', updates);
    
    // Handle organization updates specially
    if (updates.organization) {
      console.log('Updating organization:', updates.organization);
    }
    
    // Handle project team updates
    if (updates.projectMembers) {
      console.log('Updating project members:', updates.projectMembers);
    }
    
    // Call updateProject from projectService
    const { data, error } = await supabase
      .from('projects')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)
      .select();
      
    if (error) {
      console.error('Error updating project:', error);
      toast.error('Նախագծի թարմացման ժամանակ սխալ է տեղի ունեցել');
      return false;
    }
    
    toast.success('Նախագիծը հաջողությամբ թարմացվել է');
    return true;
  } catch (error) {
    console.error('Error in updateProject:', error);
    toast.error('Նախագծի թարմացման ժամանակ սխալ է տեղի ունեցել');
    return false;
  }
};
