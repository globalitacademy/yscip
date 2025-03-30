
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { supabase } from '@/integrations/supabase/client';

/**
 * Updates a course directly in the database
 */
export const updateCourseDirectly = async (
  courseId: string, 
  courseData: Partial<ProfessionalCourse>
): Promise<boolean> => {
  try {
    // Update the main course record
    const { error: courseError } = await supabase
      .from('courses')
      .update({
        title: courseData.title,
        subtitle: courseData.subtitle,
        icon_name: courseData.iconName,
        duration: courseData.duration,
        price: courseData.price,
        button_text: courseData.buttonText,
        color: courseData.color,
        institution: courseData.institution,
        image_url: courseData.imageUrl,
        organization_logo: courseData.organizationLogo,
        description: courseData.description,
        is_public: courseData.is_public,
        updated_at: new Date().toISOString()
      })
      .eq('id', courseId);
      
    if (courseError) {
      console.error('Error updating course:', courseError);
      return false;
    }
    
    // Update lessons if provided
    if (courseData.lessons && courseData.lessons.length > 0) {
      // First delete existing lessons
      await supabase.from('course_lessons').delete().eq('course_id', courseId);
      
      // Then insert new lessons
      const { error: lessonsError } = await supabase
        .from('course_lessons')
        .insert(
          courseData.lessons.map(lesson => ({
            course_id: courseId,
            title: lesson.title,
            duration: lesson.duration
          }))
        );
        
      if (lessonsError) {
        console.error('Error updating lessons:', lessonsError);
      }
    }
    
    // Update requirements if provided
    if (courseData.requirements && courseData.requirements.length > 0) {
      // First delete existing requirements
      await supabase.from('course_requirements').delete().eq('course_id', courseId);
      
      // Then insert new requirements
      const { error: requirementsError } = await supabase
        .from('course_requirements')
        .insert(
          courseData.requirements.map(requirement => ({
            course_id: courseId,
            requirement: requirement
          }))
        );
        
      if (requirementsError) {
        console.error('Error updating requirements:', requirementsError);
      }
    }
    
    // Update outcomes if provided
    if (courseData.outcomes && courseData.outcomes.length > 0) {
      // First delete existing outcomes
      await supabase.from('course_outcomes').delete().eq('course_id', courseId);
      
      // Then insert new outcomes
      const { error: outcomesError } = await supabase
        .from('course_outcomes')
        .insert(
          courseData.outcomes.map(outcome => ({
            course_id: courseId,
            outcome: outcome
          }))
        );
        
      if (outcomesError) {
        console.error('Error updating outcomes:', outcomesError);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateCourseDirectly:', error);
    return false;
  }
};
