
import { Dispatch, SetStateAction } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProfessionalCourse } from '@/components/courses/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook for course creation functionality
 */
export const useCourseCreation = (setLoading: Dispatch<SetStateAction<boolean>>) => {
  const { user } = useAuth();

  /**
   * Create a new course in the database
   */
  const createCourse = async (course: Partial<ProfessionalCourse>): Promise<boolean> => {
    setLoading(true);
    try {
      // Determine if the course should be public based on user role
      // Only admin can directly publish courses
      const isPublic = user && (user.role === 'admin') 
                       ? course.is_public
                       : false;

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
          is_public: isPublic
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating course:', error);
        toast.error('Սխալ է տեղի ունեցել դասընթաց ստեղծելիս։');
        return false;
      }
      
      const courseId = data.id;
      
      // Insert lessons if provided
      if (course.lessons && course.lessons.length > 0) {
        const { error: lessonsError } = await supabase
          .from('course_lessons')
          .insert(
            course.lessons.map(lesson => ({
              course_id: courseId,
              title: lesson.title,
              duration: lesson.duration
            }))
          );
          
        if (lessonsError) {
          console.error('Error inserting lessons:', lessonsError);
        }
      }
      
      // Insert requirements if provided
      if (course.requirements && course.requirements.length > 0) {
        const { error: requirementsError } = await supabase
          .from('course_requirements')
          .insert(
            course.requirements.map(requirement => ({
              course_id: courseId,
              requirement: requirement
            }))
          );
          
        if (requirementsError) {
          console.error('Error inserting requirements:', requirementsError);
        }
      }
      
      // Insert outcomes if provided
      if (course.outcomes && course.outcomes.length > 0) {
        const { error: outcomesError } = await supabase
          .from('course_outcomes')
          .insert(
            course.outcomes.map(outcome => ({
              course_id: courseId,
              outcome: outcome
            }))
          );
          
        if (outcomesError) {
          console.error('Error inserting outcomes:', outcomesError);
        }
      }
      
      toast.success('Դասընթացը հաջողությամբ ստեղծվել է։');
      
      // If the course couldn't be published, show a notification
      if (course.is_public && !isPublic) {
        toast.info('Դասընթացը հաջողությամբ ստեղծվել է, սակայն հրապարակման համար անհրաժեշտ է ադմինիստրատորի հաստատումը։');
      }
      
      return true;
    } catch (error) {
      console.error('Error in createCourse:', error);
      toast.error('Սխալ է տեղի ունեցել դասընթաց ստեղծելիս։');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createCourse };
};
