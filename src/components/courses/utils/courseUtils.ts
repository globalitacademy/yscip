
import { supabase } from '@/integrations/supabase/client';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { toast } from 'sonner';

export const getCourseById = async (id: string): Promise<ProfessionalCourse | null> => {
  try {
    // Fetch the course from Supabase
    const { data: course, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching course:', error);
      // Fallback to localStorage if there's an error with Supabase
      return getLocalCourseById(id);
    }

    if (!course) {
      return getLocalCourseById(id);
    }

    // Fetch related data (lessons, requirements, outcomes)
    const { data: lessons } = await supabase
      .from('course_lessons')
      .select('*')
      .eq('course_id', id);

    const { data: requirements } = await supabase
      .from('course_requirements')
      .select('*')
      .eq('course_id', id);

    const { data: outcomes } = await supabase
      .from('course_outcomes')
      .select('*')
      .eq('course_id', id);

    // Transform the data to match ProfessionalCourse structure
    const formattedCourse: ProfessionalCourse = {
      id: course.id,
      title: course.title,
      subtitle: course.subtitle,
      icon: convertIconNameToComponent(course.icon_name),
      duration: course.duration,
      price: course.price,
      buttonText: course.button_text,
      color: course.color,
      createdBy: course.created_by,
      institution: course.institution,
      imageUrl: course.image_url,
      description: course.description,
      lessons: lessons?.map(lesson => ({
        title: lesson.title, 
        duration: lesson.duration
      })) || [],
      requirements: requirements?.map(req => req.requirement) || [],
      outcomes: outcomes?.map(outcome => outcome.outcome) || []
    };

    return formattedCourse;
  } catch (error) {
    console.error('Error in getCourseById:', error);
    // Fallback to localStorage
    return getLocalCourseById(id);
  }
};

// Fallback function to get course from localStorage
const getLocalCourseById = (id: string): ProfessionalCourse | null => {
  try {
    const storedCourses = localStorage.getItem('professionalCourses');
    if (storedCourses) {
      const courses: ProfessionalCourse[] = JSON.parse(storedCourses);
      return courses.find(course => course.id === id) || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting course from localStorage:', error);
    return null;
  }
};

// Helper function to convert icon name to React component
const convertIconNameToComponent = (iconName: string): any => {
  // This is a placeholder - you'd need to implement proper icon conversion
  // based on your application's icon system
  return { className: "w-16 h-16" };
};

export const saveCourseChanges = async (course: ProfessionalCourse): Promise<boolean> => {
  try {
    if (!course) return false;

    // First update the main course data
    const { error: courseError } = await supabase
      .from('courses')
      .update({
        title: course.title,
        subtitle: course.subtitle,
        duration: course.duration,
        price: course.price,
        button_text: course.buttonText,
        color: course.color,
        created_by: course.createdBy,
        institution: course.institution,
        image_url: course.imageUrl,
        description: course.description,
        updated_at: new Date().toISOString() // Fix: Convert Date to ISO string
      })
      .eq('id', course.id);

    if (courseError) {
      console.error('Error updating course:', courseError);
      
      // If there's an error with Supabase, fallback to localStorage
      saveToLocalStorage(course);
      return true; // Return true to not break UI flow
    }

    // Delete existing related data to replace with new data
    await Promise.all([
      supabase.from('course_lessons').delete().eq('course_id', course.id),
      supabase.from('course_requirements').delete().eq('course_id', course.id),
      supabase.from('course_outcomes').delete().eq('course_id', course.id)
    ]);

    // Insert new lessons
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
      }
    }

    // Insert new requirements
    if (course.requirements && course.requirements.length > 0) {
      const { error: requirementsError } = await supabase
        .from('course_requirements')
        .insert(
          course.requirements.map(requirement => ({
            course_id: course.id,
            requirement: requirement
          }))
        );

      if (requirementsError) {
        console.error('Error inserting requirements:', requirementsError);
      }
    }

    // Insert new outcomes
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
      }
    }

    // Also update localStorage as a fallback
    saveToLocalStorage(course);

    return true;
  } catch (error) {
    console.error('Error saving course changes:', error);
    
    // If there's an error with Supabase, fallback to localStorage
    saveToLocalStorage(course);
    return true; // Return true to not break UI flow
  }
};

// Helper function to save to localStorage
const saveToLocalStorage = (course: ProfessionalCourse): void => {
  try {
    const storedCourses = localStorage.getItem('professionalCourses');
    if (storedCourses) {
      const courses: ProfessionalCourse[] = JSON.parse(storedCourses);
      const updatedCourses = courses.map(c => c.id === course.id ? course : c);
      localStorage.setItem('professionalCourses', JSON.stringify(updatedCourses));
    }
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};
