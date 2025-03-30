import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { supabase } from '@/integrations/supabase/client';
import { convertIconNameToComponent } from '@/utils/iconUtils';

export const getCourseById = async (id: string): Promise<ProfessionalCourse | null> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching course by ID:', error);
      return null;
    }
    
    if (!data) {
      return null;
    }
    
    const { data: lessonsData } = await supabase
      .from('course_lessons')
      .select('*')
      .eq('course_id', id);
      
    const { data: requirementsData } = await supabase
      .from('course_requirements')
      .select('*')
      .eq('course_id', id);
      
    const { data: outcomesData } = await supabase
      .from('course_outcomes')
      .select('*')
      .eq('course_id', id);
    
    const iconElement = convertIconNameToComponent(data.icon_name);
    
    return {
      id: data.id,
      title: data.title,
      subtitle: data.subtitle,
      icon: iconElement,
      iconName: data.icon_name,
      duration: data.duration,
      price: data.price,
      buttonText: data.button_text,
      color: data.color,
      createdBy: data.created_by,
      institution: data.institution,
      imageUrl: data.image_url,
      organizationLogo: data.organization_logo,
      description: data.description,
      is_public: data.is_public,
      lessons: lessonsData?.map(lesson => ({
        title: lesson.title,
        duration: lesson.duration
      })) || [],
      requirements: requirementsData?.map(req => req.requirement) || [],
      outcomes: outcomesData?.map(outcome => outcome.outcome) || [],
      slug: data.slug
    };
  } catch (e) {
    console.error('Error fetching course by ID:', e);
    return null;
  }
};

export const getCourseBySlug = async (slug: string): Promise<ProfessionalCourse | null> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .single();
      
    if (error) {
      console.error('Error fetching course by slug:', error);
      return null;
    }
    
    if (!data) {
      return null;
    }
    
    const { data: lessonsData } = await supabase
      .from('course_lessons')
      .select('*')
      .eq('course_id', data.id);
      
    const { data: requirementsData } = await supabase
      .from('course_requirements')
      .select('*')
      .eq('course_id', data.id);
      
    const { data: outcomesData } = await supabase
      .from('course_outcomes')
      .select('*')
      .eq('course_id', data.id);
    
    const iconElement = convertIconNameToComponent(data.icon_name);
    
    return {
      id: data.id,
      title: data.title,
      subtitle: data.subtitle,
      icon: iconElement,
      iconName: data.icon_name,
      duration: data.duration,
      price: data.price,
      buttonText: data.button_text,
      color: data.color,
      createdBy: data.created_by,
      institution: data.institution,
      imageUrl: data.image_url,
      organizationLogo: data.organization_logo,
      description: data.description,
      is_public: data.is_public,
      lessons: lessonsData?.map(lesson => ({
        title: lesson.title,
        duration: lesson.duration
      })) || [],
      requirements: requirementsData?.map(req => req.requirement) || [],
      outcomes: outcomesData?.map(outcome => outcome.outcome) || [],
      slug: data.slug
    };
  } catch (e) {
    console.error('Error fetching course by slug:', e);
    return null;
  }
};

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
        is_public: course.is_public,
        updated_at: new Date().toISOString()
      })
      .eq('id', course.id);

    if (courseError) {
      console.error('Error updating course:', courseError);
      return false;
    }

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

    return true;
  } catch (error) {
    console.error('Error saving course changes:', error);
    return false;
  }
};
