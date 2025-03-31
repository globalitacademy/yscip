
import { Dispatch, SetStateAction } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook for course deletion functionality
 */
export const useCourseDeletion = (setLoading: Dispatch<SetStateAction<boolean>>) => {
  const { user } = useAuth();

  /**
   * Delete a course from the database
   */
  const deleteCourse = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Check if user can delete this course
      if (user && user.role !== 'admin') {
        const { data: course } = await supabase
          .from('courses')
          .select('created_by')
          .eq('id', id)
          .single();
          
        if (course?.created_by !== user.name) {
          toast.error('Դուք չունեք այս դասընթացը ջնջելու իրավունք։');
          return false;
        }
      }
      
      // Delete related records first (they will cascade, but let's be explicit)
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
  };

  return { deleteCourse };
};
