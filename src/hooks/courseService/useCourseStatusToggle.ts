
import { useState } from 'react';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCourseStatusToggle = (
  course: ProfessionalCourse | null,
  setCourse: React.Dispatch<React.SetStateAction<ProfessionalCourse | null>>
) => {
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState<'delete' | 'status' | null>(null);

  const handlePublishToggle = async () => {
    if (!course) return;
    
    setLoading(true);
    setActionType('status');
    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_public: !course.is_public })
        .eq('id', course.id);
        
      if (error) {
        console.error('Error toggling publish status:', error);
        toast.error('Դասընթացի կարգավիճակի փոփոխման ժամանակ սխալ է տեղի ունեցել');
        return;
      }
      
      setCourse({
        ...course,
        is_public: !course.is_public
      });
      
      toast.success(course.is_public ? 
        'Դասընթացը հանվել է հրապարակումից' : 
        'Դասընթացը հաջողությամբ հրապարակվել է'
      );
    } catch (e) {
      console.error('Error toggling publish status:', e);
      toast.error('Դասընթացի կարգավիճակի փոփոխման ժամանակ սխալ է տեղի ունեցել');
    } finally {
      setLoading(false);
      setActionType(null);
    }
  };

  return {
    loading,
    actionType,
    setActionType,
    handlePublishToggle
  };
};
