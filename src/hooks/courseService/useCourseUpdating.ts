
import { Dispatch, SetStateAction, useCallback } from 'react';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCourseUpdating = (setLoading: Dispatch<SetStateAction<boolean>>) => {
  const updateCourse = useCallback(async (id: string, updates: Partial<ProfessionalCourse>): Promise<boolean> => {
    console.log('Starting course update with ID:', id, 'and updates:', updates);
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
      
      console.log('Successfully updated main course data for ID:', id);
      
      // Update lessons if provided
      if (updates.lessons !== undefined) {
        console.log('Updating lessons for course ID:', id);
        // First delete existing lessons
        const { error: deleteError } = await supabase
          .from('course_lessons')
          .delete()
          .eq('course_id', id);
          
        if (deleteError) {
          console.error('Error deleting existing lessons:', deleteError);
          // Continue despite error
        }
        
        // Then insert new lessons
        if (updates.lessons && updates.lessons.length > 0) {
          const { error: lessonsError } = await supabase
            .from('course_lessons')
            .insert(
              updates.lessons.map(lesson => ({
                course_id: id,
                title: lesson.title,
                duration: lesson.duration
              }))
            );
            
          if (lessonsError) {
            console.error('Error inserting lessons:', lessonsError);
          } else {
            console.log('Successfully updated lessons for course ID:', id);
          }
        }
      }
      
      // Update requirements if provided
      if (updates.requirements !== undefined) {
        console.log('Updating requirements for course ID:', id);
        // First delete existing requirements
        const { error: deleteError } = await supabase
          .from('course_requirements')
          .delete()
          .eq('course_id', id);
          
        if (deleteError) {
          console.error('Error deleting existing requirements:', deleteError);
        }
        
        // Then insert new requirements
        if (updates.requirements && updates.requirements.length > 0) {
          const { error: requirementsError } = await supabase
            .from('course_requirements')
            .insert(
              updates.requirements.map(requirement => ({
                course_id: id,
                requirement: requirement
              }))
            );
            
          if (requirementsError) {
            console.error('Error inserting requirements:', requirementsError);
          } else {
            console.log('Successfully updated requirements for course ID:', id);
          }
        }
      }
      
      // Update outcomes if provided
      if (updates.outcomes !== undefined) {
        console.log('Updating outcomes for course ID:', id);
        // First delete existing outcomes
        const { error: deleteError } = await supabase
          .from('course_outcomes')
          .delete()
          .eq('course_id', id);
          
        if (deleteError) {
          console.error('Error deleting existing outcomes:', deleteError);
        }
        
        // Then insert new outcomes
        if (updates.outcomes && updates.outcomes.length > 0) {
          const { error: outcomesError } = await supabase
            .from('course_outcomes')
            .insert(
              updates.outcomes.map(outcome => ({
                course_id: id,
                outcome: outcome
              }))
            );
            
          if (outcomesError) {
            console.error('Error inserting outcomes:', outcomesError);
          } else {
            console.log('Successfully updated outcomes for course ID:', id);
          }
        }
      }
      
      console.log('Course update completed successfully for ID:', id);
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
