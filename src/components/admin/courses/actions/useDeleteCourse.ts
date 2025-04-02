
import { useState } from 'react';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseDeleteCourseProps {
  onDelete: (courseId: string) => void;
}

export const useDeleteCourse = ({ onDelete }: UseDeleteCourseProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteCourse = async (course: ProfessionalCourse, canModify: boolean) => {
    if (!canModify) {
      toast.error("Դուք չունեք իրավունք ջնջելու այս դասընթացը");
      return;
    }
    
    setIsLoading(true);
    try {
      // First delete related data
      await Promise.all([
        supabase.from('course_lessons').delete().eq('course_id', course.id),
        supabase.from('course_requirements').delete().eq('course_id', course.id),
        supabase.from('course_outcomes').delete().eq('course_id', course.id)
      ]);

      // Then delete the course
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', course.id);

      if (error) {
        console.error('Error deleting course:', error);
        toast.error('Դասընթացի ջնջման ժամանակ սխալ է տեղի ունեցել');
        return;
      }

      // Update parent component state
      onDelete(course.id);
      setIsDeleteDialogOpen(false);
      toast.success('Դասընթացը հաջողությամբ ջնջվել է');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Դասընթացի ջնջման ժամանակ սխալ է տեղի ունեցել');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    deleteCourse
  };
};
