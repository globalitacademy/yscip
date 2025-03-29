
import { toast } from 'sonner';
import { ProfessionalCourse } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a URL-friendly slug from a course title
 */
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/--+/g, '-') // Replace multiple - with single -
    .trim(); // Trim - from start and end
};

/**
 * Creates a new course in the database
 */
export const createCourseDirectly = async (
  courseData: Omit<ProfessionalCourse, 'id' | 'createdAt'>,
  setIsLoading: (loading: boolean) => void
): Promise<boolean> => {
  try {
    setIsLoading(true);
    console.log("Creating course directly with Supabase, course data:", courseData);
    
    const courseId = uuidv4();
    
    // Create a default icon if none is provided
    const iconName = courseData.iconName || 'book';
    
    // Insert main course data
    const { data, error } = await supabase
      .from('courses')
      .insert({
        id: courseId,
        title: courseData.title,
        subtitle: courseData.subtitle || 'ԴԱՍԸՆԹԱՑ',
        icon_name: iconName,
        duration: courseData.duration,
        price: courseData.price,
        button_text: courseData.buttonText || 'Դիտել',
        color: courseData.color || 'text-amber-500',
        created_by: courseData.createdBy || 'Unknown',
        institution: courseData.institution || 'ՀՊՏՀ',
        image_url: courseData.imageUrl,
        organization_logo: courseData.organizationLogo,
        description: courseData.description || '',
        is_public: Boolean(courseData.is_public),
        slug: courseData.slug || generateSlug(courseData.title)
      })
      .select();
    
    if (error) {
      console.error('Error inserting course to Supabase:', error);
      toast.error(`Դասընթացի ստեղծման սխալ: ${error.message}`);
      return false;
    }
    
    console.log("Course created successfully:", data);
    
    // Insert related data if provided
    if (courseData.lessons && courseData.lessons.length > 0) {
      const { error: lessonsError } = await supabase
        .from('course_lessons')
        .insert(
          courseData.lessons.map(lesson => ({
            course_id: courseId,
            title: lesson.title,
            duration: lesson.duration
          }))
        );
        
      if (lessonsError) {
        console.error('Error inserting lessons:', lessonsError);
      }
    }
    
    if (courseData.requirements && courseData.requirements.length > 0) {
      const { error: requirementsError } = await supabase
        .from('course_requirements')
        .insert(
          courseData.requirements.map(requirement => ({
            course_id: courseId,
            requirement: requirement
          }))
        );
        
      if (requirementsError) {
        console.error('Error inserting requirements:', requirementsError);
      }
    }
    
    if (courseData.outcomes && courseData.outcomes.length > 0) {
      const { error: outcomesError } = await supabase
        .from('course_outcomes')
        .insert(
          courseData.outcomes.map(outcome => ({
            course_id: courseId,
            outcome: outcome
          }))
        );
        
      if (outcomesError) {
        console.error('Error inserting outcomes:', outcomesError);
      }
    }
    
    toast.success("Դասընթացը հաջողությամբ ստեղծվել է։");
    return true;
  } catch (error) {
    console.error("Error during direct course creation:", error);
    toast.error("Դասընթացի ստեղծման ժամանակ սխալ է տեղի ունեցել");
    return false;
  } finally {
    setIsLoading(false);
  }
};
