import { supabase } from '@/integrations/supabase/client';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { toast } from 'sonner';
import { Book, BrainCircuit, Code, Database, FileCode, Globe } from 'lucide-react';
import React from 'react';

// Define the event name as a constant
export const COURSE_UPDATED_EVENT = 'courseUpdated';

/**
 * Fetches a course by ID from Supabase, with fallback to localStorage
 */
export const getCourseById = async (id: string): Promise<ProfessionalCourse | null> => {
  try {
    console.log('Fetching course by ID:', id);
    
    // Try to fetch from Supabase first
    try {
      const { data: course, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching course from Supabase:', error);
        // Fall back to local storage if Supabase fails
        const localCourse = getLocalCourseById(id);
        if (localCourse) return localCourse;
        return null;
      }

      if (!course) {
        console.log('No course found in Supabase, checking localStorage');
        const localCourse = getLocalCourseById(id);
        if (localCourse) return localCourse;
        return null;
      }

      console.log('Course found in Supabase:', course);

      // Fetch related data
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

      // Ensure we have a valid icon_name
      const iconName = course.icon_name || 'book';

      // Format the course data
      const formattedCourse: ProfessionalCourse = {
        id: String(course.id), // Ensure ID is always a string
        title: course.title,
        subtitle: course.subtitle,
        icon: convertIconNameToComponent(iconName),
        iconName: iconName, // Ensure iconName is always set
        duration: course.duration,
        price: course.price,
        buttonText: course.button_text || 'Դիտել',
        color: course.color,
        createdBy: course.created_by,
        institution: course.institution,
        preferIcon: course.prefer_icon !== undefined ? course.prefer_icon : true,
        imageUrl: course.image_url,
        organizationLogo: course.image_url, // Use image_url as organization logo 
        description: course.description,
        lessons: lessons?.map(lesson => ({
          title: lesson.title, 
          duration: lesson.duration
        })) || [],
        requirements: requirements?.map(req => req.requirement) || [],
        outcomes: outcomes?.map(outcome => outcome.outcome) || []
      };

      // Update localStorage to keep it in sync
      saveToLocalStorage(formattedCourse);
      
      return formattedCourse;
    } catch (supabaseError) {
      console.error('Error in Supabase fetching:', supabaseError);
      const localCourse = getLocalCourseById(id);
      if (localCourse) return localCourse;
      return null;
    }
  } catch (error) {
    console.error('Error in getCourseById:', error);
    return null;
  }
};

/**
 * Fetches all courses from Supabase with fallback to localStorage
 */
export const getAllCourses = async (): Promise<ProfessionalCourse[]> => {
  try {
    console.log('Fetching all courses from Supabase');
    
    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching courses from Supabase:', error);
      // Fall back to localStorage
      return getAllCoursesFromLocalStorage();
    }

    if (!courses || courses.length === 0) {
      console.log('No courses found in Supabase, using localStorage');
      return getAllCoursesFromLocalStorage();
    }

    console.log('Courses found in Supabase:', courses.length);
    
    // Transform database courses to ProfessionalCourse format
    const formattedCourses: ProfessionalCourse[] = courses.map(course => {
      // Ensure we have a valid icon_name
      const iconName = course.icon_name || 'book';
      
      return {
        id: String(course.id),
        title: course.title,
        subtitle: course.subtitle,
        icon: convertIconNameToComponent(iconName),
        iconName: iconName, // Always include the iconName
        duration: course.duration,
        price: course.price,
        buttonText: course.button_text || 'Դիտել',
        color: course.color,
        createdBy: course.created_by,
        institution: course.institution,
        preferIcon: course.prefer_icon !== undefined ? course.prefer_icon : true,
        imageUrl: course.image_url,
        organizationLogo: course.image_url, // Use image_url as organizationLogo
        description: course.description,
        // Related data will be loaded separately when needed
        lessons: [],
        requirements: [],
        outcomes: []
      };
    });

    // Update localStorage to keep it in sync
    localStorage.setItem('professionalCourses', JSON.stringify(formattedCourses));
    
    return formattedCourses;
  } catch (error) {
    console.error('Error fetching all courses:', error);
    return getAllCoursesFromLocalStorage();
  }
};

/**
 * Gets all courses from localStorage
 */
export const getAllCoursesFromLocalStorage = (): ProfessionalCourse[] => {
  try {
    const storedCourses = localStorage.getItem('professionalCourses');
    if (storedCourses) {
      // Parse and ensure each course has an iconName and preferIcon
      const courses: ProfessionalCourse[] = JSON.parse(storedCourses);
      return courses.map(course => {
        // Ensure preferIcon is set
        const courseWithPreferIcon = {
          ...course,
          preferIcon: course.preferIcon !== undefined ? course.preferIcon : true
        };
        
        // If iconName is missing, try to infer it
        if (!courseWithPreferIcon.iconName) {
          const inferredIconName = inferIconNameFromCourse(courseWithPreferIcon) || 'book';
          return {
            ...courseWithPreferIcon,
            iconName: inferredIconName,
            icon: convertIconNameToComponent(inferredIconName)
          };
        }
        
        // Ensure icon element is set from iconName
        if (!courseWithPreferIcon.icon || typeof courseWithPreferIcon.icon === 'string') {
          return {
            ...courseWithPreferIcon,
            icon: convertIconNameToComponent(courseWithPreferIcon.iconName)
          };
        }
        
        return courseWithPreferIcon;
      });
    }
    return [];
  } catch (error) {
    console.error('Error getting courses from localStorage:', error);
    return [];
  }
};

/**
 * Try to infer icon name from course details if it's missing
 */
const inferIconNameFromCourse = (course: any): string | null => {
  // If the course already has an iconName, return it
  if (course.iconName) return course.iconName;
  
  // Check title for common keywords
  const title = (course.title || '').toLowerCase();
  if (title.includes('web') || title.includes('javascript') || title.includes('html')) return 'code';
  if (title.includes('python') || title.includes('ai') || title.includes('ml')) return 'ai';
  if (title.includes('database') || title.includes('sql') || title.includes('php')) return 'database';
  if (title.includes('java') || title.includes('.net') || title.includes('c#')) return 'book';
  
  // Default
  return null;
};

/**
 * Gets a specific course from localStorage by id
 */
const getLocalCourseById = (id: string): ProfessionalCourse | null => {
  try {
    const storedCourses = localStorage.getItem('professionalCourses');
    if (storedCourses) {
      const courses: ProfessionalCourse[] = JSON.parse(storedCourses);
      const course = courses.find(course => String(course.id) === String(id));
      
      if (course) {
        // Ensure preferIcon is always present
        const courseWithPreferIcon = {
          ...course,
          preferIcon: course.preferIcon !== undefined ? course.preferIcon : true
        };
        
        // Ensure iconName is always present
        if (!courseWithPreferIcon.iconName) {
          const iconName = inferIconNameFromCourse(courseWithPreferIcon) || 'book';
          return {
            ...courseWithPreferIcon,
            iconName,
            icon: convertIconNameToComponent(iconName)
          };
        }
        
        // Ensure icon element is set based on iconName
        if (!courseWithPreferIcon.icon || typeof courseWithPreferIcon.icon === 'string') {
          return {
            ...courseWithPreferIcon,
            icon: convertIconNameToComponent(courseWithPreferIcon.iconName)
          };
        }
        
        return courseWithPreferIcon;
      }
      return null;
    }
    return null;
  } catch (error) {
    console.error('Error getting course from localStorage:', error);
    return null;
  }
};

/**
 * Converts icon name string to React component
 */
export const convertIconNameToComponent = (iconName: string): React.ReactElement => {
  console.log('Converting icon name to component:', iconName);
  switch (iconName?.toLowerCase()) {
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
      console.log('Unknown icon name, defaulting to Book:', iconName);
      return React.createElement(Book, { className: "w-16 h-16" });
  }
};

/**
 * Saves course to localStorage
 */
export const saveToLocalStorage = (course: ProfessionalCourse): void => {
  try {
    // Create a deep copy to avoid reference issues
    const courseCopy = JSON.parse(JSON.stringify({
      ...course,
      // Remove the icon since it can't be serialized
      icon: undefined
    }));
    
    // Ensure the course has an iconName
    if (!courseCopy.iconName) {
      courseCopy.iconName = inferIconNameFromCourse(course) || 'book';
    }
    
    console.log("Saving course to localStorage:", courseCopy);
    
    const storedCourses = localStorage.getItem('professionalCourses');
    if (storedCourses) {
      const courses: ProfessionalCourse[] = JSON.parse(storedCourses);
      const existingCourseIndex = courses.findIndex(c => c.id === courseCopy.id);
      
      if (existingCourseIndex !== -1) {
        courses[existingCourseIndex] = courseCopy;
      } else {
        courses.push(courseCopy);
      }
      
      localStorage.setItem('professionalCourses', JSON.stringify(courses));
    } else {
      localStorage.setItem('professionalCourses', JSON.stringify([courseCopy]));
    }
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    toast.error('Տեղային պահեստում պահպանման սխալ։');
  }
};

/**
 * Converts a ProfessionalCourse object to the format expected by Supabase
 */
const convertToSupabaseCourseFormat = (course: ProfessionalCourse) => {
  // Always use the stored iconName directly
  const iconName = course.iconName || 'book';
  
  return {
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
    prefer_icon: course.preferIcon !== undefined ? course.preferIcon : true,
    description: course.description,
    updated_at: new Date().toISOString()
  };
};

/**
 * Improved function to save course changes to both Supabase and localStorage
 * Now properly handles real-time updates
 */
export const saveCourseChanges = async (course: ProfessionalCourse): Promise<boolean> => {
  try {
    if (!course) return false;

    console.log('Saving course changes:', course);
    console.log('Icon name being saved:', course.iconName);
    console.log('preferIcon value being saved:', course.preferIcon);

    // Create a deep copy to avoid mutation issues
    const courseCopy = JSON.parse(JSON.stringify(course));
    
    // Ensure the course has a valid iconName
    if (!courseCopy.iconName) {
      courseCopy.iconName = inferIconNameFromCourse(course) || 'book';
    }
    
    // Recreate the icon element based on iconName
    courseCopy.icon = convertIconNameToComponent(courseCopy.iconName);

    // Ensure preferIcon is set to a boolean value
    if (courseCopy.preferIcon === undefined) {
      courseCopy.preferIcon = true; // Default value
    }

    // First save to localStorage to ensure local synchronization
    saveToLocalStorage(courseCopy);

    // Then try to save to Supabase
    try {
      const supabaseCourse = convertToSupabaseCourseFormat(courseCopy);
      console.log('Converted course for Supabase:', supabaseCourse);
      
      // Update course in Supabase
      const { error: courseError } = await supabase
        .from('courses')
        .upsert(supabaseCourse, { onConflict: 'id' });

      if (courseError) {
        console.error('Error updating course in Supabase:', courseError);
        // We've already saved to localStorage, so we will broadcast the event locally
        toast.warning('Տվյալները պահպանվել են լոկալ, բայց կարող են չթարմացվել Supabase-ում։');
      } else {
        console.log('Course updated successfully in Supabase');
        
        // If course update was successful, also update related tables
        try {
          // Delete existing related data
          await Promise.all([
            supabase.from('course_lessons').delete().eq('course_id', courseCopy.id),
            supabase.from('course_requirements').delete().eq('course_id', courseCopy.id),
            supabase.from('course_outcomes').delete().eq('course_id', courseCopy.id)
          ]);

          // Insert new related data if available
          if (courseCopy.lessons && courseCopy.lessons.length > 0) {
            const { error: lessonsError } = await supabase
              .from('course_lessons')
              .insert(
                courseCopy.lessons.map(lesson => ({
                  course_id: courseCopy.id,
                  title: lesson.title,
                  duration: lesson.duration
                }))
              );

            if (lessonsError) {
              console.error('Error inserting lessons:', lessonsError);
            }
          }

          if (courseCopy.requirements && courseCopy.requirements.length > 0) {
            const { error: requirementsError } = await supabase
              .from('course_requirements')
              .insert(
                courseCopy.requirements.map(requirement => ({
                  course_id: courseCopy.id,
                  requirement: requirement
                }))
              );

            if (requirementsError) {
              console.error('Error inserting requirements:', requirementsError);
            }
          }

          if (courseCopy.outcomes && courseCopy.outcomes.length > 0) {
            const { error: outcomesError } = await supabase
              .from('course_outcomes')
              .insert(
                courseCopy.outcomes.map(outcome => ({
                  course_id: courseCopy.id,
                  outcome: outcome
                }))
              );

            if (outcomesError) {
              console.error('Error inserting outcomes:', outcomesError);
            }
          }
        } catch (relatedError) {
          console.error('Error updating related tables:', relatedError);
        }
      }
    } catch (supabaseError) {
      console.error('Error with Supabase operations:', supabaseError);
      toast.warning('Տվյալները պահպանվել են լոկալ, բայց չեն թարմացվել Supabase-ում։');
      // We've already saved to localStorage, so we can still broadcast the event locally
    }

    // Notify any listeners about the course change with a custom event
    // Use the deep copied course with the icon properly set
    const event = new CustomEvent(COURSE_UPDATED_EVENT, { detail: courseCopy });
    window.dispatchEvent(event);

    return true;
  } catch (error) {
    console.error('Error saving course changes:', error);
    return false;
  }
};
