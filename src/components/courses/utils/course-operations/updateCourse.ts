
import { ProfessionalCourse } from '../../types/ProfessionalCourse';
import { supabase } from '@/integrations/supabase/client';
import { convertIconNameToComponent } from '@/utils/iconUtils';

/**
 * Updates a course in the database and returns the updated course
 */
export const updateCourse = async (course: ProfessionalCourse): Promise<ProfessionalCourse | null> => {
  try {
    if (!course.id) {
      console.error('Invalid course ID for update');
      return null;
    }
    
    console.log('Updating course with ID:', course.id);
    
    // Update main course data
    const { error: courseError } = await supabase
      .from('courses')
      .update({
        title: course.title,
        subtitle: course.subtitle,
        icon_name: course.iconName,
        duration: course.duration,
        price: course.price,
        button_text: course.buttonText,
        color: course.color,
        institution: course.institution,
        image_url: course.imageUrl,
        organization_logo: course.organizationLogo,
        description: course.description,
        instructor: course.instructor,
        is_public: course.is_public,
        updated_at: new Date().toISOString()
      })
      .eq('id', course.id);
      
    if (courseError) {
      console.error('Error updating course:', courseError);
      return null;
    }
    
    // Update related data in parallel
    await Promise.all([
      // Update lessons
      updateLessons(course.id, course.lessons || []),
      
      // Update requirements
      updateRequirements(course.id, course.requirements || []),
      
      // Update outcomes
      updateOutcomes(course.id, course.outcomes || [])
    ]);
    
    // Set the icon component based on the iconName
    course.icon = convertIconNameToComponent(course.iconName || 'book');
    
    return course;
  } catch (error) {
    console.error('Error updating course:', error);
    return null;
  }
};

/**
 * Helper function to update course lessons
 */
const updateLessons = async (courseId: string, lessons: Array<{ title: string; duration: string }>) => {
  try {
    // Delete existing lessons
    await supabase.from('course_lessons').delete().eq('course_id', courseId);
    
    // Insert new lessons if they exist
    if (lessons.length > 0) {
      const { error } = await supabase
        .from('course_lessons')
        .insert(lessons.map(lesson => ({
          course_id: courseId,
          title: lesson.title,
          duration: lesson.duration
        })));
      
      if (error) {
        console.error('Error updating lessons:', error);
      }
    }
  } catch (error) {
    console.error('Error in updateLessons:', error);
  }
};

/**
 * Helper function to update course requirements
 */
const updateRequirements = async (courseId: string, requirements: string[]) => {
  try {
    // Delete existing requirements
    await supabase.from('course_requirements').delete().eq('course_id', courseId);
    
    // Insert new requirements if they exist
    if (requirements.length > 0) {
      const { error } = await supabase
        .from('course_requirements')
        .insert(requirements.map(requirement => ({
          course_id: courseId,
          requirement
        })));
      
      if (error) {
        console.error('Error updating requirements:', error);
      }
    }
  } catch (error) {
    console.error('Error in updateRequirements:', error);
  }
};

/**
 * Helper function to update course outcomes
 */
const updateOutcomes = async (courseId: string, outcomes: string[]) => {
  try {
    // Delete existing outcomes
    await supabase.from('course_outcomes').delete().eq('course_id', courseId);
    
    // Insert new outcomes if they exist
    if (outcomes.length > 0) {
      const { error } = await supabase
        .from('course_outcomes')
        .insert(outcomes.map(outcome => ({
          course_id: courseId,
          outcome
        })));
      
      if (error) {
        console.error('Error updating outcomes:', error);
      }
    }
  } catch (error) {
    console.error('Error in updateOutcomes:', error);
  }
};
