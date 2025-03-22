import React from 'react';
import * as lucideIcons from 'lucide-react';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { supabase } from '@/integrations/supabase/client';

// Event name for course updates
export const COURSE_UPDATED_EVENT = 'courseUpdated';

export const getIconComponent = (iconType: string | null) => {
  if (!iconType) return null;
  
  try {
    // These lines had the TS18047 errors - adding null checks
    if (iconType && lucideIcons[iconType as keyof typeof lucideIcons]) {
      const IconComponent = lucideIcons[iconType as keyof typeof lucideIcons];
      return IconComponent;
    }
    
    if (iconType) {
      console.warn(`Icon type "${iconType}" not found in lucide-react icons`);
    }
    
    return null;
  } catch (error) {
    console.error('Error getting icon component:', error);
    return null;
  }
};

// Function to save course changes (to Supabase and localStorage)
export const saveCourseChanges = async (course: ProfessionalCourse): Promise<boolean> => {
  try {
    // Extract icon name from the course object
    let iconName: string | null = null;
    if (typeof course.icon === 'string') {
      iconName = course.icon;
    } else if (course.icon && typeof course.icon === 'object') {
      // Try to extract the icon name from props or type
      const iconProps = (course.icon as React.ReactElement).props;
      if (iconProps && iconProps.type && iconProps.type.name) {
        iconName = iconProps.type.name;
      }
    }

    // First, try to save to Supabase
    const { error } = await supabase
      .from('courses')
      .upsert({ 
        id: course.id,
        title: course.title,
        subtitle: course.subtitle,
        duration: course.duration,
        price: course.price,
        button_text: course.buttonText,
        color: course.color,
        created_by: course.createdBy,
        institution: course.institution,
        image_url: course.imageUrl,
        organization_logo: course.organizationLogo,
        description: course.description,
        // Convert nested objects to JSON strings for storage
        // We can't store React components in the database, so we store the icon name
        icon_name: iconName
      });

    if (error) {
      console.error('Error saving to Supabase:', error);
      // Fall back to localStorage on error
      saveToLocalStorage(course);
    } else {
      // Update localStorage to keep in sync
      saveToLocalStorage(course);
      
      // Dispatch an event to notify other components of the update
      dispatchCourseUpdatedEvent(course);
    }
    
    return true;
  } catch (error) {
    console.error('Error in saveCourseChanges:', error);
    
    // Fall back to localStorage on error
    saveToLocalStorage(course);
    
    // Still dispatch the event for local updates
    dispatchCourseUpdatedEvent(course);
    
    return true; // Return true even on Supabase error if localStorage succeeded
  }
};

// Helper function to dispatch a course updated event
const dispatchCourseUpdatedEvent = (course: ProfessionalCourse): void => {
  try {
    const courseUpdatedEvent = new CustomEvent(COURSE_UPDATED_EVENT, { 
      detail: course 
    });
    window.dispatchEvent(courseUpdatedEvent);
  } catch (error) {
    console.error('Error dispatching course updated event:', error);
  }
};

// Helper function to save a course to localStorage
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

// Function to get all courses
export const getAllCourses = async (): Promise<ProfessionalCourse[]> => {
  try {
    // Try to get courses from Supabase
    const { data, error } = await supabase
      .from('courses')
      .select('*');
      
    if (error) {
      console.error('Error fetching from Supabase:', error);
      throw error;
    }
    
    if (data && data.length > 0) {
      // Transform the data to include icon components
      const coursesWithIcons = data.map(course => {
        // Convert iconName to an actual React component
        let iconComponent = null;
        if (course.icon_name && lucideIcons[course.icon_name as keyof typeof lucideIcons]) {
          const IconComponent = lucideIcons[course.icon_name as keyof typeof lucideIcons];
          iconComponent = React.createElement(IconComponent, { className: "w-16 h-16" });
        }
        
        return {
          id: course.id,
          title: course.title,
          subtitle: course.subtitle || 'ԴԱՍԸՆԹԱՑ',
          icon: iconComponent,
          duration: course.duration,
          price: course.price,
          buttonText: course.button_text || 'Դիտել',
          color: course.color || 'text-amber-500',
          createdBy: course.created_by || '',
          institution: course.institution || 'ՀՊՏՀ',
          imageUrl: course.image_url,
          organizationLogo: course.organization_logo,
          description: course.description,
          lessons: course.lessons || [],
          requirements: course.requirements || [],
          outcomes: course.outcomes || []
        } as ProfessionalCourse;
      });
      
      return coursesWithIcons;
    }
    
    // Fall back to localStorage if no data in Supabase
    const storedCourses = localStorage.getItem('professionalCourses');
    if (storedCourses) {
      return JSON.parse(storedCourses);
    }
    
    return [];
  } catch (error) {
    console.error('Error in getAllCourses:', error);
    
    // Fall back to localStorage on error
    const storedCourses = localStorage.getItem('professionalCourses');
    if (storedCourses) {
      return JSON.parse(storedCourses);
    }
    
    return [];
  }
};

// Function to get a course by ID
export const getCourseById = async (id: string): Promise<ProfessionalCourse | null> => {
  try {
    // Try to get the course from Supabase
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .maybeSingle(); // Use maybeSingle instead of single to avoid errors
      
    if (error) {
      console.error('Error fetching from Supabase:', error);
      throw error;
    }
    
    if (data) {
      // Convert iconName to an actual React component
      let iconComponent = null;
      if (data.icon_name && lucideIcons[data.icon_name as keyof typeof lucideIcons]) {
        const IconComponent = lucideIcons[data.icon_name as keyof typeof lucideIcons];
        iconComponent = React.createElement(IconComponent, { className: "w-16 h-16" });
      }
      
      return {
        id: data.id,
        title: data.title,
        subtitle: data.subtitle || 'ԴԱՍԸՆԹԱՑ',
        icon: iconComponent,
        duration: data.duration,
        price: data.price,
        buttonText: data.button_text || 'Դիտել',
        color: data.color || 'text-amber-500',
        createdBy: data.created_by || '',
        institution: data.institution || 'ՀՊՏՀ',
        imageUrl: data.image_url,
        organizationLogo: data.organization_logo,
        description: data.description,
        lessons: data.lessons || [],
        requirements: data.requirements || [],
        outcomes: data.outcomes || []
      } as ProfessionalCourse;
    }
    
    // Fall back to localStorage if not found in Supabase
    const storedCourses = localStorage.getItem('professionalCourses');
    if (storedCourses) {
      const courses: ProfessionalCourse[] = JSON.parse(storedCourses);
      return courses.find(course => course.id === id) || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error in getCourseById:', error);
    
    // Fall back to localStorage on error
    const storedCourses = localStorage.getItem('professionalCourses');
    if (storedCourses) {
      const courses: ProfessionalCourse[] = JSON.parse(storedCourses);
      return courses.find(course => course.id === id) || null;
    }
    
    return null;
  }
};

// Function to subscribe to realtime updates for courses
export const subscribeToRealtimeUpdates = (
  handleUpdate: (course: ProfessionalCourse) => void
): (() => void) => {
  // Set up Supabase realtime subscription
  const channel = supabase
    .channel('public:courses')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'courses'
      },
      async (payload) => {
        console.log('Realtime update received:', payload);
        
        // For insert or update events, get the updated course
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const courseId = payload.new.id;
          const updatedCourse = await getCourseById(courseId);
          
          if (updatedCourse) {
            handleUpdate(updatedCourse);
          }
        }
      }
    )
    .subscribe();

  // Return an unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
};
