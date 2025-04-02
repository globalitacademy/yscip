
import { Dispatch, SetStateAction, useCallback } from 'react';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCourseUpdating = (setLoading: Dispatch<SetStateAction<boolean>>) => {
  const updateCourse = useCallback(async (id: string, updates: Partial<ProfessionalCourse>): Promise<boolean> => {
    console.log('Starting course update with ID:', id, 'and updates:', updates);
    setLoading(true);
    try {
      // Prepare main course data for update
      const courseUpdateData = {
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
        instructor: updates.instructor, // Added instructor field
        is_public: updates.is_public,
        updated_at: new Date().toISOString()
      };
      
      console.log('Updating course main data:', courseUpdateData);
      
      // Update the main course record
      const { data, error: courseError } = await supabase
        .from('courses')
        .update(courseUpdateData)
        .eq('id', id)
        .select();
        
      if (courseError) {
        console.error('Error updating course:', courseError);
        toast.error('Սխալ է տեղի ունեցել դասընթացը թարմացնելիս։');
        return false;
      }
      
      console.log('Successfully updated main course data for ID:', id, 'Response:', data);
      
      // Update lessons
      console.log('Updating lessons for course ID:', id, 'lessons:', updates.lessons);
      
      // First delete existing lessons
      const { error: deleteError } = await supabase
        .from('course_lessons')
        .delete()
        .eq('course_id', id);
        
      if (deleteError) {
        console.error('Error deleting existing lessons:', deleteError);
        // Continue despite error
      }
      
      // Then insert new lessons if they exist
      if (updates.lessons && updates.lessons.length > 0) {
        const lessonData = updates.lessons.map(lesson => ({
          course_id: id,
          title: lesson.title,
          duration: lesson.duration
        }));
        
        console.log('Inserting lesson data:', lessonData);
        
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('course_lessons')
          .insert(lessonData)
          .select();
          
        if (lessonsError) {
          console.error('Error inserting lessons:', lessonsError);
        } else {
          console.log('Successfully updated lessons for course ID:', id, 'Response:', lessonsData);
        }
      } else {
        console.log('No lessons to insert for course ID:', id);
      }
      
      // Update requirements
      console.log('Updating requirements for course ID:', id, 'requirements:', updates.requirements);
      
      // First delete existing requirements
      const { error: deleteReqError } = await supabase
        .from('course_requirements')
        .delete()
        .eq('course_id', id);
        
      if (deleteReqError) {
        console.error('Error deleting existing requirements:', deleteReqError);
      }
      
      // Then insert new requirements if they exist
      if (updates.requirements && updates.requirements.length > 0) {
        const requirementData = updates.requirements.map(requirement => ({
          course_id: id,
          requirement: requirement
        }));
        
        console.log('Inserting requirement data:', requirementData);
        
        const { data: requirementsData, error: requirementsError } = await supabase
          .from('course_requirements')
          .insert(requirementData)
          .select();
          
        if (requirementsError) {
          console.error('Error inserting requirements:', requirementsError);
        } else {
          console.log('Successfully updated requirements for course ID:', id, 'Response:', requirementsData);
        }
      } else {
        console.log('No requirements to insert for course ID:', id);
      }
      
      // Update outcomes
      console.log('Updating outcomes for course ID:', id, 'outcomes:', updates.outcomes);
      
      // First delete existing outcomes
      const { error: deleteOutcomesError } = await supabase
        .from('course_outcomes')
        .delete()
        .eq('course_id', id);
        
      if (deleteOutcomesError) {
        console.error('Error deleting existing outcomes:', deleteOutcomesError);
      }
      
      // Then insert new outcomes if they exist
      if (updates.outcomes && updates.outcomes.length > 0) {
        const outcomeData = updates.outcomes.map(outcome => ({
          course_id: id,
          outcome: outcome
        }));
        
        console.log('Inserting outcome data:', outcomeData);
        
        const { data: outcomesData, error: outcomesError } = await supabase
          .from('course_outcomes')
          .insert(outcomeData)
          .select();
          
        if (outcomesError) {
          console.error('Error inserting outcomes:', outcomesError);
        } else {
          console.log('Successfully updated outcomes for course ID:', id, 'Response:', outcomesData);
        }
      } else {
        console.log('No outcomes to insert for course ID:', id);
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
