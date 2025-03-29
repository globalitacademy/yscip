
import { toast } from 'sonner';
import { ProfessionalCourse, LessonItem } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

/**
 * Error type for course submission operations
 */
export interface CourseSubmissionError extends Error {
  context?: string;
  originalError?: unknown;
}

/**
 * Creates a properly typed submission error
 */
const createSubmissionError = (message: string, context?: string, originalError?: unknown): CourseSubmissionError => {
  const error: CourseSubmissionError = new Error(message) as CourseSubmissionError;
  error.name = 'CourseSubmissionError';
  error.context = context;
  error.originalError = originalError;
  return error;
};

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
 * Type guard to validate course data before submission
 */
export const isValidCourseData = (
  courseData: Partial<ProfessionalCourse>
): courseData is Omit<ProfessionalCourse, 'id' | 'createdAt'> => {
  return (
    typeof courseData.title === 'string' &&
    courseData.title.trim().length > 0 &&
    typeof courseData.duration === 'string' &&
    courseData.duration.trim().length > 0 &&
    typeof courseData.price === 'string' &&
    courseData.price.trim().length > 0 &&
    typeof courseData.institution === 'string' &&
    courseData.institution.trim().length > 0
  );
};

/**
 * Converts ProfessionalCourse to database format
 */
interface DatabaseCourseData {
  id: string;
  title: string;
  subtitle: string | null;
  icon_name: string;
  duration: string;
  price: string;
  button_text: string | null;
  color: string;
  created_by: string;
  institution: string;
  image_url: string | null;
  organization_logo: string | null;
  description: string | null;
  is_public: boolean;
  slug: string;
}

/**
 * Maps a ProfessionalCourse to the format expected by the database
 */
const mapCourseToDatabaseFormat = (
  courseData: Omit<ProfessionalCourse, 'id' | 'createdAt'>,
  courseId: string
): DatabaseCourseData => {
  return {
    id: courseId,
    title: courseData.title,
    subtitle: courseData.subtitle || 'ԴԱՍԸՆԹԱՑ',
    icon_name: courseData.iconName || 'book',
    duration: courseData.duration,
    price: courseData.price,
    button_text: courseData.buttonText || 'Դիտել',
    color: courseData.color || 'text-amber-500',
    created_by: courseData.createdBy || 'Unknown',
    institution: courseData.institution || 'ՀՊՏՀ',
    image_url: courseData.imageUrl || null,
    organization_logo: courseData.organizationLogo || null,
    description: courseData.description || null,
    is_public: Boolean(courseData.is_public),
    slug: courseData.slug || generateSlug(courseData.title)
  };
};

/**
 * Inserts course lessons into the database
 */
const insertCourseLessons = async (courseId: string, lessons: LessonItem[]): Promise<void> => {
  if (!lessons.length) return;
  
  const { error } = await supabase
    .from('course_lessons')
    .insert(
      lessons.map(lesson => ({
        course_id: courseId,
        title: lesson.title,
        duration: lesson.duration
      }))
    );
    
  if (error) {
    throw createSubmissionError(
      'Failed to insert course lessons',
      'insertCourseLessons',
      error
    );
  }
};

/**
 * Inserts course requirements into the database
 */
const insertCourseRequirements = async (courseId: string, requirements: string[]): Promise<void> => {
  if (!requirements.length) return;
  
  const { error } = await supabase
    .from('course_requirements')
    .insert(
      requirements.map(requirement => ({
        course_id: courseId,
        requirement: requirement
      }))
    );
    
  if (error) {
    throw createSubmissionError(
      'Failed to insert course requirements',
      'insertCourseRequirements',
      error
    );
  }
};

/**
 * Inserts course outcomes into the database
 */
const insertCourseOutcomes = async (courseId: string, outcomes: string[]): Promise<void> => {
  if (!outcomes.length) return;
  
  const { error } = await supabase
    .from('course_outcomes')
    .insert(
      outcomes.map(outcome => ({
        course_id: courseId,
        outcome: outcome
      }))
    );
    
  if (error) {
    throw createSubmissionError(
      'Failed to insert course outcomes',
      'insertCourseOutcomes',
      error
    );
  }
};

/**
 * Saves the course to localStorage as a fallback
 * when database operations fail
 */
const saveToLocalStorage = (courseData: Omit<ProfessionalCourse, 'id' | 'createdAt'>): string => {
  try {
    // Generate an ID for the course
    const courseId = uuidv4();
    
    // Create the full course object
    const course = {
      ...courseData,
      id: courseId,
      createdAt: new Date().toISOString()
    };
    
    // Get existing locally stored courses
    const localCoursesJson = localStorage.getItem('professional_courses') || '[]';
    const localCourses = JSON.parse(localCoursesJson);
    
    // Add the new course
    localCourses.push(course);
    
    // Save back to localStorage
    localStorage.setItem('professional_courses', JSON.stringify(localCourses));
    
    // Dispatch an event to notify components that the local storage has been updated
    window.dispatchEvent(new CustomEvent('reload-courses-from-local'));
    
    return courseId;
  } catch (error) {
    console.error('Error saving course to localStorage:', error);
    throw createSubmissionError(
      'Failed to save course to local storage',
      'saveToLocalStorage',
      error
    );
  }
};

/**
 * Creates a new course in the database with proper error handling
 * and falls back to localStorage if database operations fail
 */
export const createCourseDirectly = async (
  courseData: Omit<ProfessionalCourse, 'id' | 'createdAt'>,
  setIsLoading: (loading: boolean) => void
): Promise<boolean> => {
  try {
    setIsLoading(true);
    console.log("Creating course directly with Supabase, course data:", courseData);
    
    // Validate course data
    if (!isValidCourseData(courseData)) {
      toast.error('Դասընթացը պետք է ունենա վերնագիր, տևողություն, գին և հաստատություն');
      return false;
    }
    
    const courseId = uuidv4();
    const databaseCourseData = mapCourseToDatabaseFormat(courseData, courseId);
    
    try {
      // Try to insert the course to Supabase
      const { data, error } = await supabase
        .from('courses')
        .insert(databaseCourseData)
        .select();
      
      if (error) {
        // If there's a database error, log it and use localStorage instead
        console.error('Error inserting course to Supabase:', error);
        
        // Check if it's a connectivity issue or policy error
        if (error.code === '42P17' || error.message.includes('policy') || error.message.includes('recursion')) {
          toast.warning('Տվյալների բազայի հետ կապ չի հաստատվել: Դասընթացը կպահպանվի լոկալ և համաժամեցվի ավելի ուշ:');
          
          // Save to localStorage as a fallback
          saveToLocalStorage(courseData);
          return true;
        }
        
        toast.error(`Դասընթացի ստեղծման սխալ: ${error.message}`);
        return false;
      }
      
      console.log("Course created successfully:", data);
      
      // If main course creation was successful, try to add related data
      try {
        // Using Promise.all to handle all insertions in parallel
        await Promise.all([
          courseData.lessons && courseData.lessons.length > 0 
            ? insertCourseLessons(courseId, courseData.lessons) 
            : Promise.resolve(),
            
          courseData.requirements && courseData.requirements.length > 0 
            ? insertCourseRequirements(courseId, courseData.requirements) 
            : Promise.resolve(),
            
          courseData.outcomes && courseData.outcomes.length > 0 
            ? insertCourseOutcomes(courseId, courseData.outcomes) 
            : Promise.resolve(),
        ]);
        
        toast.success("Դասընթացը հաջողությամբ ստեղծվել է։");
        return true;
      } catch (insertError) {
        console.error("Error inserting related course data:", insertError);
        
        // Log specific error context if available
        if ((insertError as CourseSubmissionError).context) {
          console.error(`Error context: ${(insertError as CourseSubmissionError).context}`);
        }
        
        // Still return true since the main course was created
        toast.success("Դասընթացը ստեղծվել է, բայց որոշ մանրամասներ չեն պահպանվել։");
        return true;
      }
    } catch (dbError) {
      // Handle unexpected errors during the Supabase operations
      console.error('Unexpected error during Supabase operations:', dbError);
      toast.warning('Տվյալների բազայի հետ կապ չի հաստատվել: Դասընթացը կպահպանվի լոկալ և համաժամեցվի ավելի ուշ:');
      
      // Save to localStorage as a fallback
      saveToLocalStorage(courseData);
      return true;
    }
  } catch (error) {
    console.error("Error during direct course creation:", error);
    toast.error("Դասընթացի ստեղծման ժամանակ սխալ է տեղի ունեցել");
    return false;
  } finally {
    setIsLoading(false);
  }
};
