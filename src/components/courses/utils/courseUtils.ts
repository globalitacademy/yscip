
import { supabase } from '@/integrations/supabase/client';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { toast } from 'sonner';
import { Book, BrainCircuit, Code, Database, FileCode, Globe } from 'lucide-react';
import React from 'react';

// Define the event name as a constant
export const COURSE_UPDATED_EVENT = 'courseUpdated';

export const getCourseById = async (id: string): Promise<ProfessionalCourse | null> => {
  try {
    const localCourse = getLocalCourseById(id);
    
    try {
      const { data: course, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching course:', error);
        if (localCourse) return localCourse;
        return null;
      }

      if (!course) {
        if (localCourse) return localCourse;
        return null;
      }

      let lessons = [], requirements = [], outcomes = [];
      
      try {
        const { data: lessonsData } = await supabase
          .from('course_lessons')
          .select('*')
          .eq('course_id', id);
          
        if (lessonsData) lessons = lessonsData;
      } catch (e) {
        console.error('Error fetching lessons:', e);
      }
      
      try {
        const { data: requirementsData } = await supabase
          .from('course_requirements')
          .select('*')
          .eq('course_id', id);
          
        if (requirementsData) requirements = requirementsData;
      } catch (e) {
        console.error('Error fetching requirements:', e);
      }
      
      try {
        const { data: outcomesData } = await supabase
          .from('course_outcomes')
          .select('*')
          .eq('course_id', id);
          
        if (outcomesData) outcomes = outcomesData;
      } catch (e) {
        console.error('Error fetching outcomes:', e);
      }

      const formattedCourse: ProfessionalCourse = {
        id: course.id,
        title: course.title,
        subtitle: course.subtitle,
        icon: course.icon_name ? convertIconNameToComponent(course.icon_name) : undefined,
        iconName: course.icon_name || '',
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

      saveToLocalStorage(formattedCourse);
      
      return formattedCourse;
    } catch (supabaseError) {
      console.error('Error in Supabase fetching:', supabaseError);
      if (localCourse) return localCourse;
      return null;
    }
  } catch (error) {
    console.error('Error in getCourseById:', error);
    return null;
  }
};

export const getAllCoursesFromLocalStorage = (): ProfessionalCourse[] => {
  try {
    const storedCourses = localStorage.getItem('professionalCourses');
    if (storedCourses) {
      const courses = JSON.parse(storedCourses);
      // Make sure each course has proper icon component
      return courses.map((course: ProfessionalCourse) => {
        if (course.iconName && !course.icon) {
          course.icon = convertIconNameToComponent(course.iconName);
        }
        return course;
      });
    }
    return [];
  } catch (error) {
    console.error('Error getting courses from localStorage:', error);
    return [];
  }
};

const getLocalCourseById = (id: string): ProfessionalCourse | null => {
  try {
    const storedCourses = localStorage.getItem('professionalCourses');
    if (storedCourses) {
      const courses: ProfessionalCourse[] = JSON.parse(storedCourses);
      const course = courses.find(course => course.id === id);
      if (course) {
        // Ensure the icon is properly converted to a React component
        if (course.iconName && !course.icon) {
          course.icon = convertIconNameToComponent(course.iconName);
        }
        return course;
      }
      return null;
    }
    return null;
  } catch (error) {
    console.error('Error getting course from localStorage:', error);
    return null;
  }
};

export const convertIconNameToComponent = (iconName: string): React.ReactElement => {
  switch (iconName.toLowerCase()) {
    case 'book':
      return React.createElement(Book, { className: "w-16 h-16" });
    case 'code':
      return React.createElement(Code, { className: "w-16 h-16" });
    case 'braincircuit':
    case 'brain':
    case 'ai':
      return React.createElement(BrainCircuit, { className: "w-16 h-16" });
    case 'database':
      return React.createElement(Database, { className: "w-16 h-16" });
    case 'filecode':
    case 'file':
    case 'files':
      return React.createElement(FileCode, { className: "w-16 h-16" });
    case 'globe':
    case 'web':
      return React.createElement(Globe, { className: "w-16 h-16" });
    default:
      return React.createElement(Book, { className: "w-16 h-16" });
  }
};

export const getIconNameFromComponent = (component: React.ReactElement | undefined): string => {
  if (!component) return 'book';
  
  // Extract the component display name if available
  const componentType = component.type;
  if (typeof componentType === 'function' && componentType.displayName) {
    const name = componentType.displayName.toLowerCase();
    if (name === 'braincircuit') return 'ai';
    if (name === 'filecode') return 'files';
    return name;
  }
  
  // If we can't determine the icon name from the component, return a default
  return 'book';
};

const saveToLocalStorage = (course: ProfessionalCourse): void => {
  try {
    // Store the icon name to ensure it can be recreated later
    const courseToSave = {
      ...course,
      iconName: course.iconName || getIconNameFromComponent(course.icon)
    };
    
    const storedCourses = localStorage.getItem('professionalCourses');
    if (storedCourses) {
      const courses: ProfessionalCourse[] = JSON.parse(storedCourses);
      const existingCourseIndex = courses.findIndex(c => c.id === course.id);
      
      if (existingCourseIndex !== -1) {
        courses[existingCourseIndex] = courseToSave;
      } else {
        courses.push(courseToSave);
      }
      
      localStorage.setItem('professionalCourses', JSON.stringify(courses));
    } else {
      localStorage.setItem('professionalCourses', JSON.stringify([courseToSave]));
    }
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const saveCourseChanges = async (course: ProfessionalCourse): Promise<boolean> => {
  try {
    if (!course) return false;

    console.log('Saving course changes:', course);

    // Ensure the course has an iconName for storage
    if (!course.iconName && course.icon) {
      course.iconName = getIconNameFromComponent(course.icon);
    }

    // First save to localStorage to ensure local synchronization
    saveToLocalStorage(course);

    // Then try to save to Supabase if available
    try {
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
          icon_name: course.iconName,
          description: course.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', course.id);

      if (courseError) {
        console.error('Error updating course in Supabase:', courseError);
        // Continue with local storage only
      } else {
        // If course update was successful, also update related tables
        await Promise.all([
          supabase.from('course_lessons').delete().eq('course_id', course.id),
          supabase.from('course_requirements').delete().eq('course_id', course.id),
          supabase.from('course_outcomes').delete().eq('course_id', course.id)
        ]);

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
      }
    } catch (supabaseError) {
      console.error('Error with Supabase operations:', supabaseError);
      // We've already saved to localStorage, so we can still return true
    }

    // Notify any listeners about the course change with a custom event
    const event = new CustomEvent(COURSE_UPDATED_EVENT, { detail: course });
    window.dispatchEvent(event);

    return true;
  } catch (error) {
    console.error('Error saving course changes:', error);
    return false;
  }
};
