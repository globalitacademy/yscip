
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
      
      // Try to get from localStorage as fallback
      const storedCourses = localStorage.getItem('professional_courses');
      if (storedCourses) {
        const courses = JSON.parse(storedCourses) as ProfessionalCourse[];
        const localCourse = courses.find(c => c.id === id);
        if (localCourse) {
          // Ensure the icon is correctly created
          localCourse.icon = convertIconNameToComponent(localCourse.iconName || 'book');
          return localCourse;
        }
      }
      
      return null;
    }
    
    // Fetch related data - using Promise.allSettled to ensure we get partial data even if some queries fail
    const [lessonsResponse, requirementsResponse, outcomesResponse] = await Promise.allSettled([
      supabase.from('course_lessons').select('*').eq('course_id', id),
      supabase.from('course_requirements').select('*').eq('course_id', id),
      supabase.from('course_outcomes').select('*').eq('course_id', id)
    ]);
    
    // Create icon element
    const iconElement = convertIconNameToComponent(course.icon_name);
    
    // Process lessons data
    const lessons = lessonsResponse.status === 'fulfilled' && lessonsResponse.value.data
      ? lessonsResponse.value.data.map(lesson => ({
          title: lesson.title, 
          duration: lesson.duration
        }))
      : [];
      
    // Process requirements data
    const requirements = requirementsResponse.status === 'fulfilled' && requirementsResponse.value.data
      ? requirementsResponse.value.data.map(req => req.requirement)
      : [];
    
    // Process outcomes data
    const outcomes = outcomesResponse.status === 'fulfilled' && outcomesResponse.value.data
      ? outcomesResponse.value.data.map(outcome => outcome.outcome)
      : [];
    
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
      lessons: lessons,
      requirements: requirements,
      outcomes: outcomes,
      slug: course.slug || '',
      createdAt: course.created_at || new Date().toISOString(),
      updatedAt: course.updated_at || null
    };
  } catch (error) {
    console.error("Error in getCourseById:", error);
    
    // Try to get from localStorage as fallback
    const storedCourses = localStorage.getItem('professional_courses');
    if (storedCourses) {
      const courses = JSON.parse(storedCourses) as ProfessionalCourse[];
      const localCourse = courses.find(c => c.id === id);
      if (localCourse) {
        // Ensure the icon is correctly created
        localCourse.icon = convertIconNameToComponent(localCourse.iconName || 'book');
        return localCourse;
      }
    }
    
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
      
      // Save to localStorage as a backup
      const storedCourses = localStorage.getItem('professional_courses');
      let courses = storedCourses ? JSON.parse(storedCourses) as ProfessionalCourse[] : [];
      
      // Remove the icon property which can't be serialized
      const courseToStore = {...course};
      delete courseToStore.icon;
      
      // Update or add the course
      const index = courses.findIndex(c => c.id === course.id);
      if (index >= 0) {
        courses[index] = courseToStore;
      } else {
        courses.push(courseToStore);
      }
      
      localStorage.setItem('professional_courses', JSON.stringify(courses));
    }
    
    return success;
  } catch (error) {
    console.error("Error saving course changes:", error);
    
    // Save to localStorage as a backup even if database fails
    try {
      const storedCourses = localStorage.getItem('professional_courses');
      let courses = storedCourses ? JSON.parse(storedCourses) as ProfessionalCourse[] : [];
      
      // Remove the icon property which can't be serialized
      const courseToStore = {...course};
      delete courseToStore.icon;
      
      // Update or add the course
      const index = courses.findIndex(c => c.id === course.id);
      if (index >= 0) {
        courses[index] = courseToStore;
      } else {
        courses.push(courseToStore);
      }
      
      localStorage.setItem('professional_courses', JSON.stringify(courses));
      
      // Dispatch event to notify any listeners of the update
      const updateEvent = new CustomEvent(COURSE_UPDATED_EVENT, { detail: course });
      window.dispatchEvent(updateEvent);
      
      // Return true as we were able to save to localStorage
      return true;
    } catch (localError) {
      console.error("Error saving to localStorage:", localError);
      return false;
    }
  }
};

/**
 * Get all courses from Supabase
 */
export const getAllCoursesFromSupabase = async (): Promise<ProfessionalCourse[]> => {
  try {
    // First try to get courses from localStorage as a quick load
    const storedCourses = localStorage.getItem('professional_courses');
    let localCourses: ProfessionalCourse[] = [];
    
    if (storedCourses) {
      try {
        localCourses = JSON.parse(storedCourses);
        // Process each course to ensure icons are properly created
        localCourses = localCourses.map(course => ({
          ...course,
          icon: convertIconNameToComponent(course.iconName || 'book')
        }));
        
        console.log("Loaded courses from localStorage:", localCourses.length);
      } catch (parseError) {
        console.error("Error parsing localStorage courses:", parseError);
      }
    }
    
    // Fetch all courses from database
    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching courses from Supabase:", error);
      // Return local courses as fallback
      return localCourses;
    }
    
    if (!courses || courses.length === 0) {
      // Return local courses if no database courses found
      return localCourses;
    }
    
    // Process each course from database to include related data
    const dbCoursesPromises = courses.map(async (course) => {
      try {
        // Fetch related data using Promise.allSettled to handle partial failures
        const [lessonsResponse, requirementsResponse, outcomesResponse] = await Promise.allSettled([
          supabase.from('course_lessons').select('*').eq('course_id', course.id),
          supabase.from('course_requirements').select('*').eq('course_id', course.id),
          supabase.from('course_outcomes').select('*').eq('course_id', course.id)
        ]);
        
        // Create icon element
        const iconElement = convertIconNameToComponent(course.icon_name);
        
        // Process lessons data
        const lessons = lessonsResponse.status === 'fulfilled' && lessonsResponse.value.data
          ? lessonsResponse.value.data.map(lesson => ({
              title: lesson.title, 
              duration: lesson.duration
            }))
          : [];
          
        // Process requirements data
        const requirements = requirementsResponse.status === 'fulfilled' && requirementsResponse.value.data
          ? requirementsResponse.value.data.map(req => req.requirement)
          : [];
        
        // Process outcomes data
        const outcomes = outcomesResponse.status === 'fulfilled' && outcomesResponse.value.data
          ? outcomesResponse.value.data.map(outcome => outcome.outcome)
          : [];
        
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
          lessons: lessons,
          requirements: requirements,
          outcomes: outcomes,
          slug: course.slug || '',
          createdAt: course.created_at || new Date().toISOString(),
          updatedAt: course.updated_at || null
        } as ProfessionalCourse;
      } catch (courseError) {
        console.error(`Error processing course ${course.id}:`, courseError);
        // Return null for failed courses
        return null;
      }
    });
    
    // Wait for all promises to resolve
    const dbCoursesResults = await Promise.all(dbCoursesPromises);
    
    // Filter out null results
    const dbCourses = dbCoursesResults.filter(Boolean) as ProfessionalCourse[];
    
    console.log("Loaded courses from database:", dbCourses.length);
    
    // Merge local and database courses, prioritizing database ones
    const mergedCourses = [...dbCourses];
    
    // Add local courses that don't exist in the database
    for (const localCourse of localCourses) {
      if (!dbCourses.some(dbCourse => dbCourse.id === localCourse.id)) {
        mergedCourses.push(localCourse);
      }
    }
    
    // Update localStorage with the merged courses (without icons for serialization)
    const coursesToStore = mergedCourses.map(course => {
      const { icon, ...rest } = course;
      return rest;
    });
    
    localStorage.setItem('professional_courses', JSON.stringify(coursesToStore));
    
    return mergedCourses;
  } catch (error) {
    console.error("Error in getAllCoursesFromSupabase:", error);
    
    // Try to get courses from localStorage as fallback
    const storedCourses = localStorage.getItem('professional_courses');
    if (storedCourses) {
      try {
        const courses = JSON.parse(storedCourses) as ProfessionalCourse[];
        // Process each course to ensure icons are properly created
        return courses.map(course => ({
          ...course,
          icon: convertIconNameToComponent(course.iconName || 'book')
        }));
      } catch (parseError) {
        console.error("Error parsing localStorage courses:", parseError);
      }
    }
    
    return [];
  }
};
