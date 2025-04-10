
import { ProfessionalCourse } from '../../types/ProfessionalCourse';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Saves changes to an existing course in the database
 * @param course The updated course data
 * @returns A boolean indicating success or failure
 */
export const saveCourseChanges = async (course: ProfessionalCourse): Promise<boolean> => {
  try {
    if (!course || !course.id) {
      console.error('Invalid course data for saving changes');
      return false;
    }

    console.log('Saving course changes for:', course.title);
    
    // Prepare the update object with only the fields that exist in the database
    const courseUpdateData: Record<string, any> = {
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
      created_by: course.createdBy,
      instructor: course.instructor,
      is_public: course.is_public,
      show_on_homepage: course.show_on_homepage,
      display_order: course.display_order,
      author_type: course.author_type || 'lecturer',
      instructor_ids: course.instructor_ids || [],
      updated_at: new Date().toISOString()
    };
    
    // Include optional fields only if they exist in the course object
    if (course.category !== undefined) {
      courseUpdateData.category = course.category;
    }
    
    // Store arrays as proper Postgres arrays if they exist
    if (Array.isArray(course.learning_formats)) {
      courseUpdateData.learning_formats = course.learning_formats;
    }
    
    if (Array.isArray(course.languages)) {
      courseUpdateData.languages = course.languages;
    }
    
    if (course.syllabus_file) {
      courseUpdateData.syllabus_file = course.syllabus_file;
    }

    // Update the main course record with all available fields
    const { error: courseError } = await supabase
      .from('courses')
      .update(courseUpdateData)
      .eq('id', course.id);

    if (courseError) {
      console.error('Error updating course:', courseError);
      return false;
    }

    // Handle lessons
    try {
      const { error: deleteError } = await supabase
        .from('course_lessons')
        .delete()
        .eq('course_id', course.id);
  
      if (deleteError) {
        console.error('Error deleting existing lessons:', deleteError);
        // Continue despite error
      }
  
      if (course.lessons && course.lessons.length > 0) {
        const { error: lessonsError } = await supabase
          .from('course_lessons')
          .insert(
            course.lessons.map(lesson => ({
              course_id: course.id,
              title: lesson.title,
              duration: lesson.duration
            }))
          );
  
        if (lessonsError) {
          console.error('Error inserting lessons:', lessonsError);
          // Continue despite error
        }
      }
    } catch (lessonsError) {
      console.error('Error handling lessons:', lessonsError);
      // Continue despite error
    }

    // Handle requirements
    try {
      const { error: deleteReqError } = await supabase
        .from('course_requirements')
        .delete()
        .eq('course_id', course.id);
  
      if (deleteReqError) {
        console.error('Error deleting existing requirements:', deleteReqError);
        // Continue despite error
      }
  
      if (course.requirements && course.requirements.length > 0) {
        const { error: reqError } = await supabase
          .from('course_requirements')
          .insert(
            course.requirements.map(req => ({
              course_id: course.id,
              requirement: req
            }))
          );
  
        if (reqError) {
          console.error('Error inserting requirements:', reqError);
          // Continue despite error
        }
      }
    } catch (requirementsError) {
      console.error('Error handling requirements:', requirementsError);
      // Continue despite error
    }

    // Handle outcomes
    try {
      const { error: deleteOutcomesError } = await supabase
        .from('course_outcomes')
        .delete()
        .eq('course_id', course.id);
  
      if (deleteOutcomesError) {
        console.error('Error deleting existing outcomes:', deleteOutcomesError);
        // Continue despite error
      }
  
      if (course.outcomes && course.outcomes.length > 0) {
        const { error: outcomesError } = await supabase
          .from('course_outcomes')
          .insert(
            course.outcomes.map(outcome => ({
              course_id: course.id,
              outcome: outcome
            }))
          );
  
        if (outcomesError) {
          console.error('Error inserting outcomes:', outcomesError);
          // Continue despite error
        }
      }
    } catch (outcomesError) {
      console.error('Error handling outcomes:', outcomesError);
      // Continue despite error
    }

    // Handle instructors
    try {
      if (course.instructors && course.instructors.length > 0) {
        // First delete existing instructors
        const { error: deleteInstructorsError } = await supabase
          .from('course_instructors')
          .delete()
          .eq('course_id', course.id);
  
        if (deleteInstructorsError) {
          console.error('Error deleting existing instructors:', deleteInstructorsError);
          // Continue despite error
        }
  
        // Then insert the updated instructors
        const { error: instructorsError } = await supabase
          .from('course_instructors')
          .insert(
            course.instructors.map(instructor => ({
              course_id: course.id,
              name: instructor.name,
              title: instructor.title,
              bio: instructor.bio,
              avatar_url: instructor.avatar_url
            }))
          );
  
        if (instructorsError) {
          console.error('Error inserting instructors:', instructorsError);
          // Continue despite error
        }
      }
    } catch (instructorsError) {
      console.error('Error handling instructors:', instructorsError);
      // Continue despite error
    }

    console.log('Course successfully updated:', course.title);
    return true;
  } catch (error) {
    console.error('Error saving course changes:', error);
    return false;
  }
};
