import { Dispatch, SetStateAction } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProfessionalCourse } from '@/components/courses/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook for course updating functionality
 */
export const useCourseUpdating = (setLoading: Dispatch<SetStateAction<boolean>>) => {
  const { user } = useAuth();

  /**
   * Update a course in the database
   */
  const updateCourse = async (id: string, updates: Partial<ProfessionalCourse>): Promise<boolean> => {
    setLoading(true);
    try {
      // Determine if the user can publish the course
      let isPublic = updates.is_public;
      
      // If user is not admin, they can't publish courses
      if (user && user.role !== 'admin') {
        // Get current course state
        const { data: currentCourse } = await supabase
          .from('courses')
          .select('is_public, created_by')
          .eq('id', id)
          .single();
          
        // If the course is already public, keep it public
        // If not, it requires admin approval to be published
        isPublic = currentCourse?.is_public || false;
        
        // If the user tries to publish their own course, show a notification
        if (updates.is_public && !isPublic && currentCourse?.created_by === user.name) {
          toast.info('Դասընթացի հրապարակման համար անհրաժեշտ է ադմինիստրատորի հաստատումը։');
        }
      }

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
          is_public: isPublic,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (courseError) {
        console.error('Error updating course:', courseError);
        toast.error('Սխալ է տեղի ունեցել դասընթացը թարմացնելիս։');
        return false;
      }
      
      // Update lessons if provided
      if (updates.lessons && updates.lessons.length > 0) {
        // First delete existing lessons
        await supabase.from('course_lessons').delete().eq('course_id', id);
        
        // Then insert new lessons
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
          console.error('Error updating lessons:', lessonsError);
        }
      }
      
      // Update requirements if provided
      if (updates.requirements && updates.requirements.length > 0) {
        // First delete existing requirements
        await supabase.from('course_requirements').delete().eq('course_id', id);
        
        // Then insert new requirements
        const { error: requirementsError } = await supabase
          .from('course_requirements')
          .insert(
            updates.requirements.map(requirement => ({
              course_id: id,
              requirement: requirement
            }))
          );
          
        if (requirementsError) {
          console.error('Error updating requirements:', requirementsError);
        }
      }
      
      // Update outcomes if provided
      if (updates.outcomes && updates.outcomes.length > 0) {
        // First delete existing outcomes
        await supabase.from('course_outcomes').delete().eq('course_id', id);
        
        // Then insert new outcomes
        const { error: outcomesError } = await supabase
          .from('course_outcomes')
          .insert(
            updates.outcomes.map(outcome => ({
              course_id: id,
              outcome: outcome
            }))
          );
          
        if (outcomesError) {
          console.error('Error updating outcomes:', outcomesError);
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
  };

  return { updateCourse };
};
