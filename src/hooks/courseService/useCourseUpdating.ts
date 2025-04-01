
import { Dispatch, SetStateAction, useCallback } from 'react';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCourseUpdating = (setLoading: Dispatch<SetStateAction<boolean>>) => {
  const updateCourse = useCallback(async (id: string, updates: Partial<ProfessionalCourse>): Promise<boolean> => {
    setLoading(true);
    try {
      // Update the main course record
      const { error: courseError } = await supabase
        .from('courses')
        .update({
          title: updates.title,
          subtitle: updates.subtitle,
          icon_name: updates.iconName,
          duration: updates.duration,
          price: updates.price,
          button_text: updates.buttonText,
          color: updates.color,
          institution: updates.institution,
          image_url: updates.imageUrl,
          organization_logo: updates.organizationLogo,
          description: updates.description,
          is_public: updates.is_public,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (courseError) {
        console.error('Error updating course:', courseError);
        toast.error('Սխալ է տեղի ունեցել դասընթացը թարմացնելիս։');
        return false;
      }
      
      // Update lessons if provided
      if (updates.lessons) {
        // First delete existing lessons
        await supabase.from('course_lessons').delete().eq('course_id', id);
        
        // Then insert new lessons
        if (updates.lessons.length > 0) {
          await supabase
            .from('course_lessons')
            .insert(
              updates.lessons.map(lesson => ({
                course_id: id,
                title: lesson.title,
                duration: lesson.duration
              }))
            );
        }
      }
      
      // Update requirements if provided
      if (updates.requirements) {
        // First delete existing requirements
        await supabase.from('course_requirements').delete().eq('course_id', id);
        
        // Then insert new requirements
        if (updates.requirements.length > 0) {
          await supabase
            .from('course_requirements')
            .insert(
              updates.requirements.map(requirement => ({
                course_id: id,
                requirement: requirement
              }))
            );
        }
      }
      
      // Update outcomes if provided
      if (updates.outcomes) {
        // First delete existing outcomes
        await supabase.from('course_outcomes').delete().eq('course_id', id);
        
        // Then insert new outcomes
        if (updates.outcomes.length > 0) {
          await supabase
            .from('course_outcomes')
            .insert(
              updates.outcomes.map(outcome => ({
                course_id: id,
                outcome: outcome
              }))
            );
        }
      }
      
      toast.success('Դասընթացը հաջողությամբ թարմացվել է։');
      return true;
    } catch (error) {
      console.error('Error in updateCourse:', error);
      toast.error('Սխալ է տեղի ունեցել դասընթացը թարմացնելիս։');
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  return { updateCourse };
};
