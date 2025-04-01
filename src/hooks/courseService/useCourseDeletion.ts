
import { Dispatch, SetStateAction, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCourseDeletion = (setLoading: Dispatch<SetStateAction<boolean>>) => {
  const deleteCourse = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Delete related records first to avoid foreign key constraints
      await Promise.allSettled([
        supabase.from('course_lessons').delete().eq('course_id', id),
        supabase.from('course_requirements').delete().eq('course_id', id),
        supabase.from('course_outcomes').delete().eq('course_id', id)
      ]);
      
      // Delete the main course record
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error('Error deleting course:', error);
        toast.error('Սխալ է տեղի ունեցել դասընթաց ջնջելիս։');
        return false;
      }
      
      toast.success('Դասընթացը հաջողությամբ ջնջվել է։');
      return true;
    } catch (error) {
      console.error('Error in deleteCourse:', error);
      toast.error('Սխալ է տեղի ունեցել դասընթաց ջնջելիս։');
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  return { deleteCourse };
};
