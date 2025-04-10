
import { Dispatch, SetStateAction, useCallback } from 'react';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCourseUpdating = (
  setLoading: Dispatch<SetStateAction<boolean>>, 
  setError: Dispatch<SetStateAction<string | null>>
) => {
  const updateCourse = useCallback(async (id: string, updates: Partial<ProfessionalCourse>): Promise<boolean> => {
    console.log('Starting course update with ID:', id);
    console.log('Course update payload:', JSON.stringify(updates, null, 2));
    
    if (!id) {
      console.error('Invalid course ID for update');
      toast.error('Անվավեր դասընթացի ID');
      return false;
    }
    
    setLoading(true);
    try {
      // Prepare main course data for update
      const courseUpdateData: Record<string, any> = {
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
        instructor: updates.instructor,
        is_public: updates.is_public,
        show_on_homepage: updates.show_on_homepage,
        display_order: updates.display_order,
        updated_at: new Date().toISOString()
      };
      
      // Remove undefined values to avoid errors
      Object.keys(courseUpdateData).forEach(key => {
        if (courseUpdateData[key] === undefined) {
          delete courseUpdateData[key];
        }
      });
      
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
        setError(`Update error: ${courseError.message}`);
        return false;
      }
      
      console.log('Successfully updated main course data for ID:', id, 'Response:', data);
      
      // Update lessons if they exist
      if (updates.lessons) {
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
        if (updates.lessons.length > 0) {
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
      }
      
      // Update requirements if they exist
      if (updates.requirements) {
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
        if (updates.requirements.length > 0) {
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
      }
      
      // Update outcomes if they exist
      if (updates.outcomes) {
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
        if (updates.outcomes.length > 0) {
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
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateCourse:', error);
      toast.error('Սխալ է տեղի ունեցել դասընթացը թարմացնելիս։');
      setError(`Update error: ${String(error)}`);
      return false;
    } finally {
      setLoading(false);
    }
  });

  return { updateCourse };
};
