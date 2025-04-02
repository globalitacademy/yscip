
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCourseDelete = (courseId: string | undefined) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteCourse = async () => {
    if (!courseId) return;
    
    setLoading(true);
    try {
      await Promise.all([
        supabase.from('course_lessons').delete().eq('course_id', courseId),
        supabase.from('course_requirements').delete().eq('course_id', courseId),
        supabase.from('course_outcomes').delete().eq('course_id', courseId)
      ]);
      
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);
        
      if (error) {
        console.error('Error deleting course:', error);
        toast.error('Դասընթացի ջնջման ժամանակ սխալ է տեղի ունեցել');
        return;
      }
      
      toast.success('Դասընթացը հաջողությամբ ջնջվել է');
      navigate('/admin/courses');
    } catch (e) {
      console.error('Error deleting course:', e);
      toast.error('Դասընթացի ջնջման ժամանակ սխալ է տեղի ունեցել');
    } finally {
      setLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDeleteCourse,
    loading
  };
};
