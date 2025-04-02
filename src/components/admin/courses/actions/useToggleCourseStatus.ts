
import { useState } from 'react';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseToggleCourseStatusProps {
  onStatusChange: (updatedCourse: ProfessionalCourse) => void;
}

export const useToggleCourseStatus = ({ onStatusChange }: UseToggleCourseStatusProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const toggleCourseStatus = async (course: ProfessionalCourse, canModify: boolean) => {
    if (!canModify) {
      toast.error("Դուք չունեք իրավունք փոխելու այս դասընթացի կարգավիճակը");
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_public: !course.is_public })
        .eq('id', course.id);

      if (error) {
        console.error('Error updating course status:', error);
        toast.error('Դասընթացի կարգավիճակի փոփոխման ժամանակ սխալ է տեղի ունեցել');
        return;
      }

      // Update local state
      const updatedCourse = { ...course, is_public: !course.is_public };
      onStatusChange(updatedCourse);
      
      toast.success(
        course.is_public 
          ? 'Դասընթացը հանվել է հրապարակումից' 
          : 'Դասընթացը հաջողությամբ հրապարակվել է'
      );
    } catch (error) {
      console.error('Error toggling course status:', error);
      toast.error('Դասընթացի կարգավիճակի փոփոխման ժամանակ սխալ է տեղի ունեցել');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    toggleCourseStatus
  };
};
