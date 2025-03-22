
import { supabase } from '@/integrations/supabase/client';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { toast } from 'sonner';
import { Book, BrainCircuit, Code, Database, FileCode, Globe } from 'lucide-react';
import React from 'react';

// Define the event name as a constant
export const COURSE_UPDATED_EVENT = 'courseUpdated';

/**
 * Fetches a course by ID from Supabase
 */
export const getCourseById = async (id: string): Promise<ProfessionalCourse | null> => {
  try {
    console.log('Fetching course by ID:', id);
    
    // Fetch from Supabase
    const { data: course, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching course from Supabase:', error);
      toast.error('Դասընթացի տվյալների բեռնման սխալ');
      return null;
    }

    if (!course) {
      console.log('No course found in Supabase');
      toast.error('Դասընթացը չի գտնվել');
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

    // Format the course data
    const formattedCourse: ProfessionalCourse = {
      id: course.id,
      title: course.title,
      subtitle: course.subtitle,
      icon: convertIconNameToComponent(course.icon_name),
      duration: course.duration,
      price: course.price,
      buttonText: course.button_text || 'Դիտել',
      color: course.color,
      createdBy: course.created_by,
      institution: course.institution,
      imageUrl: course.image_url,
      organizationLogo: course.organization_logo || course.image_url,
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
    toast.error('Դասընթացի տվյալների բեռնման սխալ');
    return null;
  }
};

/**
 * Fetches all courses from Supabase
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
      toast.error('Դասընթացների տվյալների բեռնման սխալ');
      return [];
    }

    if (!courses || courses.length === 0) {
      console.log('No courses found in Supabase');
      return [];
    }

    console.log('Courses found in Supabase:', courses.length);
    
    // Transform database courses to ProfessionalCourse format
    const formattedCourses: ProfessionalCourse[] = courses.map(course => ({
      id: course.id,
      title: course.title,
      subtitle: course.subtitle,
      icon: convertIconNameToComponent(course.icon_name),
      duration: course.duration,
      price: course.price,
      buttonText: course.button_text || 'Դիտել',
      color: course.color,
      createdBy: course.created_by,
      institution: course.institution,
      imageUrl: course.image_url,
      organizationLogo: course.organization_logo || course.image_url,
      description: course.description,
      // Related data will be loaded separately when needed
      lessons: [],
      requirements: [],
      outcomes: []
    }));
    
    return formattedCourses;
  } catch (error) {
    console.error('Error fetching all courses:', error);
    toast.error('Դասընթացների տվյալների բեռնման սխալ');
    return [];
  }
};

/**
 * Converts icon name string to React component
 */
const convertIconNameToComponent = (iconName: string): React.ReactElement => {
  switch (iconName?.toLowerCase()) {
    case 'book':
      return React.createElement(Book, { className: "w-16 h-16" });
    case 'code':
      return React.createElement(Code, { className: "w-16 h-16" });
    case 'braincircuit':
    case 'brain':
      return React.createElement(BrainCircuit, { className: "w-16 h-16" });
    case 'database':
      return React.createElement(Database, { className: "w-16 h-16" });
    case 'filecode':
    case 'file':
      return React.createElement(FileCode, { className: "w-16 h-16" });
    case 'globe':
      return React.createElement(Globe, { className: "w-16 h-16" });
    default:
      return React.createElement(Book, { className: "w-16 h-16" });
  }
};

/**
 * Converts a ProfessionalCourse object to the format expected by Supabase
 */
const convertToSupabaseCourseFormat = (course: ProfessionalCourse) => {
  let iconName = 'book';
  
  // Determine icon name from the course's icon
  if (course.icon) {
    // Get the icon type safely
    const iconType = course.icon.type;
    
    // Ensure iconType is not null before trying to access it
    if (iconType) {
      // Check if iconType is an object
      if (typeof iconType === 'object') {
        // Check if it has a 'name' property
        if (iconType !== null && 'name' in iconType && iconType.name) {
          // Now it's safe to access name and convert to lowercase
          iconName = String(iconType.name).toLowerCase();
        }
      }
    }
  }
  
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
    organization_logo: course.organizationLogo,
    description: course.description,
    updated_at: new Date().toISOString()
  };
};

/**
 * Saves course changes to Supabase
 * Broadcasts a courseUpdated event
 */
export const saveCourseChanges = async (course: ProfessionalCourse): Promise<boolean> => {
  try {
    if (!course) return false;

    console.log('Saving course changes:', course);

    const supabaseCourse = convertToSupabaseCourseFormat(course);
    
    // Update course in Supabase
    const { error: courseError } = await supabase
      .from('courses')
      .upsert(supabaseCourse, { onConflict: 'id' });

    if (courseError) {
      console.error('Error updating course in Supabase:', courseError);
      toast.error('Դասընթացի թարմացման սխալ');
      return false;
    }

    console.log('Course updated successfully in Supabase');
    
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

    // Notify any listeners about the course change with a custom event
    const event = new CustomEvent(COURSE_UPDATED_EVENT, { detail: course });
    window.dispatchEvent(event);

    toast.success('Դասընթացը հաջողությամբ թարմացվել է');
    return true;
  } catch (error) {
    console.error('Error saving course changes:', error);
    toast.error('Դասընթացի թարմացման սխալ');
    return false;
  }
};

/**
 * Sets up Supabase realtime subscription for courses
 */
export const subscribeToRealtimeUpdates = (onCourseUpdated: (course: ProfessionalCourse) => void) => {
  // Ensure Supabase realtime channel is enabled for this table
  try {
    const channel = supabase
      .channel('public:courses')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'courses' 
        }, 
        async (payload) => {
          console.log('Realtime update received:', payload);
          
          // When we get an update notification, fetch the full course with related data
          if (payload.new && payload.new.id) {
            const updatedCourse = await getCourseById(payload.new.id);
            if (updatedCourse) {
              // Call the callback with the updated course
              onCourseUpdated(updatedCourse);
            }
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  } catch (error) {
    console.error('Error setting up realtime subscription:', error);
    return () => {};
  }
};
