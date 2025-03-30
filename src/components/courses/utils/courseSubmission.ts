
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a URL-friendly slug from a title
 */
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/--+/g, '-')     // Replace multiple hyphens with single hyphen
    .trim();
};

/**
 * Create a course directly in Supabase, bypassing context
 */
export const createCourseDirectly = async (
  course: Omit<ProfessionalCourse, 'id' | 'createdAt'>,
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>
): Promise<boolean> => {
  if (setIsLoading) setIsLoading(true);
  
  try {
    console.log("Creating course directly in Supabase:", course);
    
    // Generate a UUID for the new course
    const courseId = uuidv4();
    
    // Create slug if not provided
    const slug = course.slug || generateSlug(course.title);
    
    // Insert the main course record
    const { error: courseError } = await supabase
      .from('courses')
      .insert({
        id: courseId,
        title: course.title,
        subtitle: course.subtitle || 'ԴԱՍԸՆԹԱՑ',
        icon_name: course.iconName || 'book',
        duration: course.duration,
        price: course.price,
        button_text: course.buttonText || 'Դիտել',
        color: course.color || 'text-amber-500',
        created_by: course.createdBy || 'Unknown',
        institution: course.institution || 'ՀՊՏՀ',
        image_url: course.imageUrl,
        organization_logo: course.organizationLogo,
        description: course.description || '',
        is_public: course.is_public !== undefined ? course.is_public : true,
        slug: slug
      });
      
    if (courseError) {
      console.error("Error creating course in Supabase:", courseError);
      toast.error("Դասընթացի ստեղծման ժամանակ սխալ է տեղի ունեցել");
      return false;
    }
    
    // Insert lessons if provided
    if (course.lessons && course.lessons.length > 0) {
      const { error: lessonsError } = await supabase
        .from('course_lessons')
        .insert(
          course.lessons.map(lesson => ({
            id: uuidv4(),
            course_id: courseId,
            title: lesson.title,
            duration: lesson.duration
          }))
        );
        
      if (lessonsError) {
        console.error("Error adding lessons:", lessonsError);
        // Continue with creation despite lesson errors
      }
    }
    
    // Insert requirements if provided
    if (course.requirements && course.requirements.length > 0) {
      const { error: requirementsError } = await supabase
        .from('course_requirements')
        .insert(
          course.requirements.map(req => ({
            id: uuidv4(),
            course_id: courseId,
            requirement: req
          }))
        );
        
      if (requirementsError) {
        console.error("Error adding requirements:", requirementsError);
        // Continue with creation despite requirement errors
      }
    }
    
    // Insert outcomes if provided
    if (course.outcomes && course.outcomes.length > 0) {
      const { error: outcomesError } = await supabase
        .from('course_outcomes')
        .insert(
          course.outcomes.map(outcome => ({
            id: uuidv4(),
            course_id: courseId,
            outcome: outcome
          }))
        );
        
      if (outcomesError) {
        console.error("Error adding outcomes:", outcomesError);
        // Continue with creation despite outcome errors
      }
    }
    
    // If we get here, course creation was successful
    toast.success("Դասընթացը հաջողությամբ ստեղծվել է");
    return true;
  } catch (error) {
    console.error("Error in createCourseDirectly:", error);
    toast.error("Սերվերի հետ կապի խնդիր։ Դասընթացը պահվել է լոկալ և կսինխրոնացվի ավելի ուշ։");
    
    // Save course to localStorage for later synchronization
    try {
      const localCourses = JSON.parse(localStorage.getItem('pending_courses') || '[]');
      const courseWithId = {
        ...course,
        id: uuidv4(), // Add temporary ID
        createdAt: new Date().toISOString() // Add creation timestamp
      };
      localCourses.push(courseWithId);
      localStorage.setItem('pending_courses', JSON.stringify(localCourses));
      toast.success("Դասընթացը պահվել է լոկալ և կսինխրոնացվի կապի վերականգնման դեպքում");
      return true;
    } catch (localError) {
      console.error("Error saving course to localStorage:", localError);
      return false;
    }
  } finally {
    if (setIsLoading) setIsLoading(false);
  }
};

/**
 * Update a course directly in Supabase
 */
export const updateCourseDirectly = async (
  courseId: string,
  courseUpdates: Partial<ProfessionalCourse>,
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>
): Promise<boolean> => {
  if (setIsLoading) setIsLoading(true);
  
  try {
    // Update the main course record
    const { error: courseError } = await supabase
      .from('courses')
      .update({
        title: courseUpdates.title,
        subtitle: courseUpdates.subtitle,
        icon_name: courseUpdates.iconName,
        duration: courseUpdates.duration,
        price: courseUpdates.price,
        button_text: courseUpdates.buttonText,
        color: courseUpdates.color,
        institution: courseUpdates.institution,
        image_url: courseUpdates.imageUrl,
        organization_logo: courseUpdates.organizationLogo,
        description: courseUpdates.description,
        is_public: courseUpdates.is_public,
        updated_at: new Date().toISOString(),
        slug: courseUpdates.slug || (courseUpdates.title ? generateSlug(courseUpdates.title) : undefined)
      })
      .eq('id', courseId);
      
    if (courseError) {
      console.error("Error updating course in Supabase:", courseError);
      toast.error("Դասընթացի թարմացման ժամանակ սխալ է տեղի ունեցել");
      return false;
    }
    
    // Update lessons
    if (courseUpdates.lessons) {
      // First delete existing lessons
      await supabase.from('course_lessons').delete().eq('course_id', courseId);
      
      // Then insert updated lessons
      if (courseUpdates.lessons.length > 0) {
        const { error: lessonsError } = await supabase
          .from('course_lessons')
          .insert(
            courseUpdates.lessons.map(lesson => ({
              id: uuidv4(),
              course_id: courseId,
              title: lesson.title,
              duration: lesson.duration
            }))
          );
          
        if (lessonsError) {
          console.error("Error updating lessons:", lessonsError);
        }
      }
    }
    
    // Update requirements
    if (courseUpdates.requirements) {
      // First delete existing requirements
      await supabase.from('course_requirements').delete().eq('course_id', courseId);
      
      // Then insert updated requirements
      if (courseUpdates.requirements.length > 0) {
        const { error: requirementsError } = await supabase
          .from('course_requirements')
          .insert(
            courseUpdates.requirements.map(req => ({
              id: uuidv4(),
              course_id: courseId,
              requirement: req
            }))
          );
          
        if (requirementsError) {
          console.error("Error updating requirements:", requirementsError);
        }
      }
    }
    
    // Update outcomes
    if (courseUpdates.outcomes) {
      // First delete existing outcomes
      await supabase.from('course_outcomes').delete().eq('course_id', courseId);
      
      // Then insert updated outcomes
      if (courseUpdates.outcomes.length > 0) {
        const { error: outcomesError } = await supabase
          .from('course_outcomes')
          .insert(
            courseUpdates.outcomes.map(outcome => ({
              id: uuidv4(),
              course_id: courseId,
              outcome: outcome
            }))
          );
          
        if (outcomesError) {
          console.error("Error updating outcomes:", outcomesError);
        }
      }
    }
    
    toast.success("Դասընթացը հաջողությամբ թարմացվել է");
    return true;
  } catch (error) {
    console.error("Error in updateCourseDirectly:", error);
    toast.error("Դասընթացի թարմացման ժամանակ սխալ է տեղի ունեցել");
    return false;
  } finally {
    if (setIsLoading) setIsLoading(false);
  }
};
