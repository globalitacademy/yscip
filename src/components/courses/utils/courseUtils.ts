
import { supabase } from '@/integrations/supabase/client';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { toast } from 'sonner';
import { Book, BrainCircuit, Code, Database, FileCode, Globe } from 'lucide-react';
import React from 'react';

// Define the event name as a constant
export const COURSE_UPDATED_EVENT = 'courseUpdated';

export const getCourseById = async (id: string): Promise<ProfessionalCourse | null> => {
  try {
    console.log('Fetching course with ID:', id);
    
    // First try to fetch from Supabase
    try {
      const { data: course, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching course from Supabase:', error);
        // If Supabase fails, fall back to local storage
        const localCourse = getLocalCourseById(id);
        return localCourse;
      }

      if (!course) {
        console.log('Course not found in Supabase, checking local storage');
        const localCourse = getLocalCourseById(id);
        return localCourse;
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

      // Create a proper React element for the icon
      const iconElement = convertIconNameToComponent(course.icon_name);

      const formattedCourse: ProfessionalCourse = {
        id: course.id,
        title: course.title,
        subtitle: course.subtitle,
        icon: iconElement,
        iconName: course.icon_name,
        duration: course.duration,
        price: course.price,
        buttonText: course.button_text,
        color: course.color,
        createdBy: course.created_by,
        institution: course.institution,
        imageUrl: course.image_url,
        organizationLogo: course.organization_logo,
        description: course.description,
        lessons: lessons?.map(lesson => ({
          title: lesson.title, 
          duration: lesson.duration
        })) || [],
        requirements: requirements?.map(req => req.requirement) || [],
        outcomes: outcomes?.map(outcome => outcome.outcome) || []
      };

      // Update local storage for offline access
      saveToLocalStorage(formattedCourse);
      
      return formattedCourse;
    } catch (supabaseError) {
      console.error('Error in Supabase fetching:', supabaseError);
      // If Supabase fails, fall back to local storage
      const localCourse = getLocalCourseById(id);
      return localCourse;
    }
  } catch (error) {
    console.error('Error in getCourseById:', error);
    return null;
  }
};

export const getAllCoursesFromSupabase = async (): Promise<ProfessionalCourse[]> => {
  try {
    console.log('Fetching all courses from Supabase');
    const { data, error } = await supabase
      .from('courses')
      .select('*');
      
    if (error) {
      console.error('Error fetching courses from Supabase:', error);
      return getAllCoursesFromLocalStorage();
    }
    
    if (!data || data.length === 0) {
      console.log('No courses found in Supabase, using local storage');
      return getAllCoursesFromLocalStorage();
    }
    
    // Process each course to format it properly
    const formattedCourses: ProfessionalCourse[] = await Promise.all(data.map(async (course) => {
      // Fetch related data for each course
      const { data: lessonsData } = await supabase
        .from('course_lessons')
        .select('*')
        .eq('course_id', course.id);
        
      const { data: requirementsData } = await supabase
        .from('course_requirements')
        .select('*')
        .eq('course_id', course.id);
        
      const { data: outcomesData } = await supabase
        .from('course_outcomes')
        .select('*')
        .eq('course_id', course.id);
        
      // Create icon component
      const iconElement = convertIconNameToComponent(course.icon_name);
      
      return {
        id: course.id,
        title: course.title,
        subtitle: course.subtitle,
        icon: iconElement,
        iconName: course.icon_name,
        duration: course.duration,
        price: course.price,
        buttonText: course.button_text,
        color: course.color,
        createdBy: course.created_by,
        institution: course.institution,
        imageUrl: course.image_url,
        organizationLogo: course.organization_logo,
        description: course.description,
        lessons: lessonsData?.map(lesson => ({
          title: lesson.title, 
          duration: lesson.duration
        })) || [],
        requirements: requirementsData?.map(req => req.requirement) || [],
        outcomes: outcomesData?.map(outcome => outcome.outcome) || []
      };
    }));
    
    // Update local storage with the fetched courses
    localStorage.setItem('professionalCourses', JSON.stringify(formattedCourses));
    
    return formattedCourses;
  } catch (error) {
    console.error('Error fetching all courses from Supabase:', error);
    return getAllCoursesFromLocalStorage();
  }
};

export const getAllCoursesFromLocalStorage = (): ProfessionalCourse[] => {
  try {
    const storedCourses = localStorage.getItem('professionalCourses');
    if (storedCourses) {
      return JSON.parse(storedCourses);
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
      return courses.find(course => course.id === id) || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting course from localStorage:', error);
    return null;
  }
};

const convertIconNameToComponent = (iconName: string): React.ReactElement => {
  let IconComponent;
  
  switch (iconName?.toLowerCase()) {
    case 'book':
      IconComponent = Book;
      break;
    case 'code':
      IconComponent = Code;
      break;
    case 'braincircuit':
    case 'brain':
      IconComponent = BrainCircuit;
      break;
    case 'database':
      IconComponent = Database;
      break;
    case 'filecode':
    case 'file':
      IconComponent = FileCode;
      break;
    case 'globe':
      IconComponent = Globe;
      break;
    default:
      IconComponent = Book;
  }
  
  return React.createElement(IconComponent, { className: "w-16 h-16" });
};

const saveToLocalStorage = (course: ProfessionalCourse): void => {
  try {
    const storedCourses = localStorage.getItem('professionalCourses');
    if (storedCourses) {
      const courses: ProfessionalCourse[] = JSON.parse(storedCourses);
      const existingCourseIndex = courses.findIndex(c => c.id === course.id);
      
      if (existingCourseIndex !== -1) {
        courses[existingCourseIndex] = course;
      } else {
        courses.push(course);
      }
      
      localStorage.setItem('professionalCourses', JSON.stringify(courses));
    } else {
      localStorage.setItem('professionalCourses', JSON.stringify([course]));
    }
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const saveCourseChanges = async (course: ProfessionalCourse): Promise<boolean> => {
  try {
    if (!course) return false;

    console.log('Saving course changes to Supabase:', course);

    // Extract the icon name from the course object or from the iconName property
    const iconName = course.iconName || getIconNameFromElement(course.icon);

    // First try to save to Supabase
    try {
      const { error: courseError } = await supabase
        .from('courses')
        .update({
          title: course.title,
          subtitle: course.subtitle,
          icon_name: iconName,
          duration: course.duration,
          price: course.price,
          button_text: course.buttonText,
          color: course.color,
          created_by: course.createdBy,
          institution: course.institution,
          image_url: course.imageUrl,
          organization_logo: course.organizationLogo,
          description: course.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', course.id);

      if (courseError) {
        console.error('Error updating course in Supabase:', courseError);
        // Try to check if course exists
        const { data: existingCourse, error: checkError } = await supabase
          .from('courses')
          .select('id')
          .eq('id', course.id)
          .maybeSingle();
          
        if (checkError || !existingCourse) {
          // Course does not exist, let's create it
          const { error: insertError } = await supabase
            .from('courses')
            .insert({
              id: course.id,
              title: course.title,
              subtitle: course.subtitle,
              icon_name: iconName,
              duration: course.duration,
              price: course.price,
              button_text: course.buttonText,
              color: course.color,
              created_by: course.createdBy,
              institution: course.institution,
              image_url: course.imageUrl,
              organization_logo: course.organizationLogo,
              description: course.description,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
            
          if (insertError) {
            console.error('Error inserting course in Supabase:', insertError);
            // Save to localStorage as fallback
            saveToLocalStorage(course);
          }
        } else {
          // Save to localStorage as fallback
          saveToLocalStorage(course);
        }
      } else {
        // If course update was successful, also update related tables
        if (course.lessons && course.lessons.length > 0) {
          // First delete existing lessons
          await supabase.from('course_lessons').delete().eq('course_id', course.id);
          
          // Then insert new lessons
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
          // First delete existing requirements
          await supabase.from('course_requirements').delete().eq('course_id', course.id);
          
          // Then insert new requirements
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
          // First delete existing outcomes
          await supabase.from('course_outcomes').delete().eq('course_id', course.id);
          
          // Then insert new outcomes
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

    // Always save to localStorage for offline access
    saveToLocalStorage(course);

    // Notify any listeners about the course change with a custom event
    const event = new CustomEvent(COURSE_UPDATED_EVENT, { detail: course });
    window.dispatchEvent(event);

    return true;
  } catch (error) {
    console.error('Error saving course changes:', error);
    return false;
  }
};

// Helper function to extract icon name from React element
const getIconNameFromElement = (iconElement: React.ReactElement): string => {
  if (!iconElement) return 'book';
  
  const iconType = iconElement.type;
  
  // Check if iconType is a function (component) and access properties safely
  if (typeof iconType === 'function') {
    // Try to get displayName or name from the function component
    // Use type assertion to help TypeScript understand this is a function component
    const component = iconType as React.FC;
    const iconName = component.displayName || component.name;
    if (iconName) {
      return iconName.toLowerCase();
    }
  } else if (typeof iconType === 'string') {
    // If it's a string (HTML element), use that
    return iconType.toLowerCase();
  }
  
  // Default fallback
  return 'book';
};

export const syncCoursesToSupabase = async (): Promise<void> => {
  try {
    // Get all courses from local storage
    const localCourses = getAllCoursesFromLocalStorage();
    
    if (localCourses.length === 0) {
      console.log('No local courses to sync to Supabase');
      return;
    }
    
    // For each local course, try to save it to Supabase
    for (const course of localCourses) {
      await saveCourseChanges(course);
    }
    
    console.log('Successfully synced local courses to Supabase');
    toast.success('Դասընթացները հաջողությամբ համաժամեցվել են բազայի հետ');
  } catch (error) {
    console.error('Error syncing courses to Supabase:', error);
    toast.error('Դասընթացների համաժամեցման ժամանակ սխալ է տեղի ունեցել');
  }
};
