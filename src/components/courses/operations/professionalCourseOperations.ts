
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { getIconFromName, getIconNameFromElement } from '../utils/iconUtils';
import React from 'react';

// Fetch professional courses from Supabase
export const fetchProfessionalCourses = async (): Promise<ProfessionalCourse[]> => {
  try {
    // Fetch courses
    const { data: coursesData, error: coursesError } = await supabase
      .from('courses')
      .select('*');
    
    if (coursesError) {
      console.error('Error fetching courses:', coursesError);
      toast.error('Սխալ դասընթացների բեռնման ժամանակ');
      return [];
    }

    const coursesList: ProfessionalCourse[] = [];
    
    // Fetch related data for each course
    for (const course of coursesData) {
      // Fetch lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('course_lessons')
        .select('*')
        .eq('course_id', course.id);
        
      if (lessonsError) {
        console.error('Error fetching lessons:', lessonsError);
      }
      
      // Fetch requirements
      const { data: requirementsData, error: requirementsError } = await supabase
        .from('course_requirements')
        .select('*')
        .eq('course_id', course.id);
        
      if (requirementsError) {
        console.error('Error fetching requirements:', requirementsError);
      }
      
      // Fetch outcomes
      const { data: outcomesData, error: outcomesError } = await supabase
        .from('course_outcomes')
        .select('*')
        .eq('course_id', course.id);
        
      if (outcomesError) {
        console.error('Error fetching outcomes:', outcomesError);
      }
      
      // Transform to ProfessionalCourse format
      const professionalCourse: ProfessionalCourse = {
        id: course.id,
        title: course.title,
        subtitle: course.subtitle,
        icon: getIconFromName(course.icon_name),
        icon_name: course.icon_name,
        duration: course.duration,
        price: course.price,
        button_text: course.button_text,
        color: course.color,
        created_by: course.created_by,
        institution: course.institution,
        image_url: course.image_url,
        description: course.description,
        is_persistent: true,
        lessons: lessonsData?.map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          duration: lesson.duration
        })) || [],
        requirements: requirementsData?.map(req => req.requirement) || [],
        outcomes: outcomesData?.map(outcome => outcome.outcome) || [],
        created_at: course.created_at,
        updated_at: course.updated_at
      };
      
      coursesList.push(professionalCourse);
    }
    
    return coursesList;
  } catch (error) {
    console.error('Error fetching professional courses:', error);
    toast.error('Սխալ դասընթացների բեռնման ժամանակ');
    return [];
  }
};

// Add a professional course to Supabase
export const addProfessionalCourse = async (
  newCourse: Partial<ProfessionalCourse>,
  userName: string | undefined
): Promise<boolean> => {
  if (!newCourse.title || !newCourse.duration || !newCourse.price) {
    toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
    return false;
  }

  try {
    // Prepare the icon name
    const iconName = newCourse.icon_name || 
                    getIconNameFromElement(newCourse.icon as React.ReactElement);

    // Insert course into database
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .insert({
        title: newCourse.title,
        subtitle: newCourse.subtitle || 'ԴԱՍԸՆԹԱՑ',
        icon_name: iconName,
        duration: newCourse.duration,
        price: newCourse.price,
        button_text: newCourse.button_text || 'Դիտել',
        color: newCourse.color || 'text-amber-500',
        created_by: userName || 'Unknown',
        institution: newCourse.institution || 'ՀՊՏՀ',
        image_url: newCourse.image_url,
        description: newCourse.description,
        is_persistent: true
      })
      .select();

    if (courseError) {
      console.error('Error adding course:', courseError);
      toast.error('Սխալ դասընթացի ավելացման ժամանակ');
      return false;
    }

    const newCourseId = courseData[0].id;

    // Add lessons if any
    if (newCourse.lessons && newCourse.lessons.length > 0) {
      const lessonsToAdd = newCourse.lessons.map(lesson => ({
        course_id: newCourseId,
        title: lesson.title,
        duration: lesson.duration
      }));

      const { error: lessonsError } = await supabase
        .from('course_lessons')
        .insert(lessonsToAdd);

      if (lessonsError) {
        console.error('Error adding lessons:', lessonsError);
      }
    }

    // Add requirements if any
    if (newCourse.requirements && newCourse.requirements.length > 0) {
      const requirementsToAdd = newCourse.requirements.map(req => ({
        course_id: newCourseId,
        requirement: req
      }));

      const { error: requirementsError } = await supabase
        .from('course_requirements')
        .insert(requirementsToAdd);

      if (requirementsError) {
        console.error('Error adding requirements:', requirementsError);
      }
    }

    // Add outcomes if any
    if (newCourse.outcomes && newCourse.outcomes.length > 0) {
      const outcomesToAdd = newCourse.outcomes.map(outcome => ({
        course_id: newCourseId,
        outcome: outcome
      }));

      const { error: outcomesError } = await supabase
        .from('course_outcomes')
        .insert(outcomesToAdd);

      if (outcomesError) {
        console.error('Error adding outcomes:', outcomesError);
      }
    }

    toast.success('Դասընթացը հաջողությամբ ավելացվել է');
    return true;
  } catch (error) {
    console.error('Error in addProfessionalCourse:', error);
    toast.error('Սխալ դասընթացի ավելացման ժամանակ');
    return false;
  }
};

// Edit a professional course in Supabase
export const editProfessionalCourse = async (
  course: ProfessionalCourse | null
): Promise<boolean> => {
  if (!course) return false;
  
  if (!course.title || !course.duration || !course.price) {
    toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
    return false;
  }

  try {
    console.log('Updating course with data:', course);
    
    // Ensure we have the icon name
    const iconName = course.icon_name || 
                    getIconNameFromElement(course.icon as React.ReactElement);

    // Update the course in the database
    const { error: courseError } = await supabase
      .from('courses')
      .update({
        title: course.title,
        subtitle: course.subtitle,
        icon_name: iconName,
        duration: course.duration,
        price: course.price,
        button_text: course.button_text,
        color: course.color,
        created_by: course.created_by,
        institution: course.institution,
        image_url: course.image_url,
        description: course.description,
        updated_at: new Date().toISOString()
      })
      .eq('id', course.id);

    if (courseError) {
      console.error('Error updating course:', courseError);
      toast.error('Սխալ դասընթացի թարմացման ժամանակ');
      return false;
    }

    // First, delete all related data and then re-insert
    
    // Handle lessons
    if (course.lessons) {
      // Delete existing lessons
      const { error: deleteLessonsError } = await supabase
        .from('course_lessons')
        .delete()
        .eq('course_id', course.id);
      
      if (deleteLessonsError) {
        console.error('Error deleting lessons:', deleteLessonsError);
      }
      
      // Add updated lessons
      if (course.lessons.length > 0) {
        const lessonsToAdd = course.lessons.map(lesson => ({
          course_id: course.id,
          title: lesson.title,
          duration: lesson.duration
        }));

        const { error: lessonsError } = await supabase
          .from('course_lessons')
          .insert(lessonsToAdd);

        if (lessonsError) {
          console.error('Error updating lessons:', lessonsError);
        }
      }
    }

    // Handle requirements
    if (course.requirements) {
      // Delete existing requirements
      const { error: deleteRequirementsError } = await supabase
        .from('course_requirements')
        .delete()
        .eq('course_id', course.id);
      
      if (deleteRequirementsError) {
        console.error('Error deleting requirements:', deleteRequirementsError);
      }
      
      // Add updated requirements
      if (course.requirements.length > 0) {
        const requirementsToAdd = course.requirements.map(req => ({
          course_id: course.id,
          requirement: req
        }));

        const { error: requirementsError } = await supabase
          .from('course_requirements')
          .insert(requirementsToAdd);

        if (requirementsError) {
          console.error('Error updating requirements:', requirementsError);
        }
      }
    }

    // Handle outcomes
    if (course.outcomes) {
      // Delete existing outcomes
      const { error: deleteOutcomesError } = await supabase
        .from('course_outcomes')
        .delete()
        .eq('course_id', course.id);
      
      if (deleteOutcomesError) {
        console.error('Error deleting outcomes:', deleteOutcomesError);
      }
      
      // Add updated outcomes
      if (course.outcomes.length > 0) {
        const outcomesToAdd = course.outcomes.map(outcome => ({
          course_id: course.id,
          outcome: outcome
        }));

        const { error: outcomesError } = await supabase
          .from('course_outcomes')
          .insert(outcomesToAdd);

        if (outcomesError) {
          console.error('Error updating outcomes:', outcomesError);
        }
      }
    }

    toast.success('Դասընթացը հաջողությամբ թարմացվել է');
    return true;
  } catch (error) {
    console.error('Error in editProfessionalCourse:', error);
    toast.error('Սխալ դասընթացի թարմացման ժամանակ');
    return false;
  }
};

// Delete a professional course from Supabase
export const deleteProfessionalCourse = async (
  courseId: string,
  userRole: string | undefined
): Promise<boolean> => {
  // Only allow admins to delete courses
  if (userRole !== 'admin') {
    toast.error('Դուք չունեք իրավունք ջնջելու այս դասընթացը');
    return false;
  }

  try {
    // Delete the course (cascade will delete related records)
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId);

    if (error) {
      console.error('Error deleting course:', error);
      toast.error('Սխալ դասընթացի ջնջման ժամանակ');
      return false;
    }
    
    toast.success('Դասընթացը հաջողությամբ հեռացվել է');
    return true;
  } catch (error) {
    console.error('Error in deleteProfessionalCourse:', error);
    toast.error('Սխալ դասընթացի ջնջման ժամանակ');
    return false;
  }
};

// Migrate courses from localStorage to Supabase
export const migrateProfessionalCourses = async (): Promise<boolean> => {
  try {
    // Get courses from localStorage
    const storedCourses = localStorage.getItem('professionalCourses');
    if (!storedCourses) return false;
    
    const localCourses: ProfessionalCourse[] = JSON.parse(storedCourses);
    if (!localCourses.length) return false;
    
    // Migrate each course
    for (const course of localCourses) {
      // Prepare the icon name
      const iconName = getIconNameFromElement(course.icon as React.ReactElement);
      
      // Insert course
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .insert({
          title: course.title,
          subtitle: course.subtitle || 'ԴԱՍԸՆԹԱՑ',
          icon_name: iconName,
          duration: course.duration,
          price: course.price,
          button_text: course.button_text || 'Դիտել',
          color: course.color || 'text-amber-500',
          created_by: course.created_by || 'Unknown',
          institution: course.institution || 'ՀՊՏՀ',
          image_url: course.image_url,
          description: course.description,
          is_persistent: true
        })
        .select();
      
      if (courseError) {
        console.error('Error migrating course:', courseError);
        continue;
      }
      
      const newCourseId = courseData[0].id;
      
      // Migrate lessons
      if (course.lessons && course.lessons.length > 0) {
        const lessonsToAdd = course.lessons.map(lesson => ({
          course_id: newCourseId,
          title: lesson.title,
          duration: lesson.duration
        }));
        
        const { error: lessonsError } = await supabase
          .from('course_lessons')
          .insert(lessonsToAdd);
        
        if (lessonsError) {
          console.error('Error migrating lessons:', lessonsError);
        }
      }
      
      // Migrate requirements
      if (course.requirements && course.requirements.length > 0) {
        const requirementsToAdd = course.requirements.map(req => ({
          course_id: newCourseId,
          requirement: req
        }));
        
        const { error: requirementsError } = await supabase
          .from('course_requirements')
          .insert(requirementsToAdd);
        
        if (requirementsError) {
          console.error('Error migrating requirements:', requirementsError);
        }
      }
      
      // Migrate outcomes
      if (course.outcomes && course.outcomes.length > 0) {
        const outcomesToAdd = course.outcomes.map(outcome => ({
          course_id: newCourseId,
          outcome: outcome
        }));
        
        const { error: outcomesError } = await supabase
          .from('course_outcomes')
          .insert(outcomesToAdd);
        
        if (outcomesError) {
          console.error('Error migrating outcomes:', outcomesError);
        }
      }
    }
    
    // Clear localStorage after migration
    localStorage.removeItem('professionalCourses');
    
    toast.success('Դասընթացները հաջողությամբ տեղափոխվել են տվյալների բազա');
    return true;
  } catch (error) {
    console.error('Error migrating courses:', error);
    toast.error('Սխալ դասընթացների տեղափոխման ժամանակ');
    return false;
  }
};
