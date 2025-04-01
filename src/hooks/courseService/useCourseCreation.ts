
import { Dispatch, SetStateAction, useCallback } from 'react';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useCourseCreation = (setLoading: Dispatch<SetStateAction<boolean>>) => {
  const { user } = useAuth();
  
  const createCourse = useCallback(async (course: Partial<ProfessionalCourse>): Promise<boolean> => {
    setLoading(true);
    try {
      // Insert the main course record
      const { data, error } = await supabase
        .from('courses')
        .insert({
          title: course.title,
          subtitle: course.subtitle,
          icon_name: course.iconName || 'book',
          duration: course.duration,
          price: course.price,
          button_text: course.buttonText,
          color: course.color,
          created_by: user?.name || course.createdBy,
          institution: course.institution,
          image_url: course.imageUrl,
          organization_logo: course.organizationLogo,
          description: course.description,
          is_public: course.is_public
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating course:', error);
        toast.error('Սխալ է տեղի ունեցել դասընթաց ստեղծելիս։');
        return false;
      }
      
      const courseId = data.id;
      
      // Insert related data (lessons, requirements, outcomes)
      // Insert lessons if provided
      if (course.lessons && course.lessons.length > 0) {
        await supabase
          .from('course_lessons')
          .insert(
            course.lessons.map(lesson => ({
              course_id: courseId,
              title: lesson.title,
              duration: lesson.duration
            }))
          );
      }
      
      // Insert requirements if provided
      if (course.requirements && course.requirements.length > 0) {
        await supabase
          .from('course_requirements')
          .insert(
            course.requirements.map(requirement => ({
              course_id: courseId,
              requirement: requirement
            }))
          );
      }
      
      // Insert outcomes if provided
      if (course.outcomes && course.outcomes.length > 0) {
        await supabase
          .from('course_outcomes')
          .insert(
            course.outcomes.map(outcome => ({
              course_id: courseId,
              outcome: outcome
            }))
          );
      }
      
      toast.success('Դասընթացը հաջողությամբ ստեղծվել է։');
      return true;
    } catch (error) {
      console.error('Error in createCourse:', error);
      toast.error('Սխալ է տեղի ունեցել դասընթաց ստեղծելիս։');
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading, user]);

  return { createCourse };
};
