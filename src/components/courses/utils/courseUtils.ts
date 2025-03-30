
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { supabase } from '@/integrations/supabase/client';
import { convertIconNameToComponent } from '@/utils/iconUtils';
import { createCourseDirectly, updateCourseDirectly } from './courseSubmission';

// Event name for course updates
export const COURSE_UPDATED_EVENT = 'course-updated';

/**
 * Get a course by ID from Supabase
 */
export const getCourseById = async (id: string): Promise<ProfessionalCourse | null> => {
  try {
    // Fetch the course
    const { data: course, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error || !course) {
      console.error("Error fetching course:", error);
      return null;
    }
    
    // Fetch related data
    const [lessonsResponse, requirementsResponse, outcomesResponse] = await Promise.all([
      supabase.from('course_lessons').select('*').eq('course_id', id),
      supabase.from('course_requirements').select('*').eq('course_id', id),
      supabase.from('course_outcomes').select('*').eq('course_id', id)
    ]);
    
    // Create icon element
    const iconElement = convertIconNameToComponent(course.icon_name);
    
    // Construct and return the ProfessionalCourse object
    return {
      id: course.id,
      title: course.title,
      subtitle: course.subtitle || 'ԴԱՍԸՆԹԱՑ',
      icon: iconElement,
      iconName: course.icon_name,
      duration: course.duration,
      price: course.price,
      buttonText: course.button_text || 'Դիտել',
      color: course.color || 'text-amber-500',
      createdBy: course.created_by || '',
      institution: course.institution || 'ՀՊՏՀ',
      imageUrl: course.image_url,
      organizationLogo: course.organization_logo,
      description: course.description || '',
      is_public: course.is_public || false,
      lessons: lessonsResponse.data?.map(lesson => ({
        title: lesson.title, 
        duration: lesson.duration
      })) || [],
      requirements: requirementsResponse.data?.map(req => req.requirement) || [],
      outcomes: outcomesResponse.data?.map(outcome => outcome.outcome) || [],
      slug: course.slug || '',
      createdAt: course.created_at || new Date().toISOString(),
      updatedAt: course.updated_at || null
    };
  } catch (error) {
    console.error("Error in getCourseById:", error);
    return null;
  }
};

/**
 * Save course changes to the database and dispatch an event
 */
export const saveCourseChanges = async (course: ProfessionalCourse): Promise<boolean> => {
  try {
    // If the course has an ID, update it, otherwise create a new course
    const success = course.id 
      ? await updateCourseDirectly(course.id, course)
      : await createCourseDirectly(course);
      
    if (success) {
      // Dispatch event to notify any listeners of the update
      const updateEvent = new CustomEvent(COURSE_UPDATED_EVENT, { detail: course });
      window.dispatchEvent(updateEvent);
    }
    
    return success;
  } catch (error) {
    console.error("Error saving course changes:", error);
    return false;
  }
};

/**
 * Get all courses from Supabase
 */
export const getAllCoursesFromSupabase = async (): Promise<ProfessionalCourse[]> => {
  try {
    // Fetch all courses
    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching courses from Supabase:", error);
      return [];
    }
    
    if (!courses || courses.length === 0) {
      return [];
    }
    
    // Process each course to include related data
    const coursesWithDetails = await Promise.all(courses.map(async (course) => {
      // Fetch related data
      const [lessonsResponse, requirementsResponse, outcomesResponse] = await Promise.all([
        supabase.from('course_lessons').select('*').eq('course_id', course.id),
        supabase.from('course_requirements').select('*').eq('course_id', course.id),
        supabase.from('course_outcomes').select('*').eq('course_id', course.id)
      ]);
      
      // Create icon element
      const iconElement = convertIconNameToComponent(course.icon_name);
      
      // Return the complete course object
      return {
        id: course.id,
        title: course.title,
        subtitle: course.subtitle || 'ԴԱՍԸՆԹԱՑ',
        icon: iconElement,
        iconName: course.icon_name,
        duration: course.duration,
        price: course.price,
        buttonText: course.button_text || 'Դիտել',
        color: course.color || 'text-amber-500',
        createdBy: course.created_by || '',
        institution: course.institution || 'ՀՊՏՀ',
        imageUrl: course.image_url,
        organizationLogo: course.organization_logo,
        description: course.description || '',
        is_public: course.is_public || false,
        lessons: lessonsResponse.data?.map(lesson => ({
          title: lesson.title, 
          duration: lesson.duration
        })) || [],
        requirements: requirementsResponse.data?.map(req => req.requirement) || [],
        outcomes: outcomesResponse.data?.map(outcome => outcome.outcome) || [],
        slug: course.slug || '',
        createdAt: course.created_at || new Date().toISOString(),
        updatedAt: course.updated_at || null
      } as ProfessionalCourse;
    }));
    
    return coursesWithDetails;
  } catch (error) {
    console.error("Error in getAllCoursesFromSupabase:", error);
    return [];
  }
};
