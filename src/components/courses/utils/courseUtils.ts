import { supabase } from '@/integrations/supabase/client';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { toast } from 'sonner';
import { Book, BrainCircuit, Code, Database, FileCode, Globe } from 'lucide-react';
import React from 'react';

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
  switch (iconName.toLowerCase()) {
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

    // Notify any listeners about the course change
    const event = new CustomEvent('courseUpdated', { detail: course });
    window.dispatchEvent(event);

    return true;
  } catch (error) {
    console.error('Error saving course changes:', error);
    return false;
  }
};
