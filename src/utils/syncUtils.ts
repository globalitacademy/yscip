
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProfessionalCourse } from '@/components/courses/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Synchronizes courses from localStorage to the database
 * This can be called when connectivity is restored
 */
export const syncLocalCoursesToDatabase = async (): Promise<boolean> => {
  try {
    // Get courses from localStorage
    const localCoursesJson = localStorage.getItem('professional_courses');
    if (!localCoursesJson) {
      return true; // No local courses to sync
    }
    
    const localCourses = JSON.parse(localCoursesJson) as ProfessionalCourse[];
    if (!localCourses.length) {
      return true; // No local courses to sync
    }
    
    // Check if we can connect to the database
    const { error: testError } = await supabase.from('courses').select('id').limit(1);
    if (testError) {
      console.error('Cannot connect to database for synchronization:', testError);
      toast.error('Տվյալների բազայի հետ կապ չի հաստատվել: Փորձեք ավելի ուշ:');
      return false;
    }
    
    let successCount = 0;
    let failCount = 0;
    
    // Process each local course
    for (const course of localCourses) {
      try {
        // Check if the course already exists in the database
        const { data: existingCourse } = await supabase
          .from('courses')
          .select('id')
          .eq('id', course.id)
          .single();
        
        if (existingCourse) {
          // Course already exists, don't try to insert it again
          successCount++;
          continue;
        }
        
        // Insert the main course
        const { error: courseError } = await supabase.from('courses').insert({
          id: course.id,
          title: course.title,
          subtitle: course.subtitle || 'ԴԱՍԸՆԹԱՑ',
          icon_name: course.iconName || 'book',
          duration: course.duration,
          price: course.price,
          button_text: course.buttonText || 'Դիտել',
          color: course.color || 'text-amber-500',
          created_by: course.createdBy || 'Unknown',
          institution: course.institution || 'ՀՊՏՀ',
          image_url: course.imageUrl || null,
          organization_logo: course.organizationLogo || null,
          description: course.description || null,
          is_public: course.is_public || false,
          slug: course.slug || course.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/--+/g, '-').trim()
        });
        
        if (courseError) {
          console.error(`Error syncing course ${course.id}:`, courseError);
          failCount++;
          continue;
        }
        
        // Insert related data if available
        
        // Insert lessons
        if (course.lessons && course.lessons.length > 0) {
          await supabase.from('course_lessons').insert(
            course.lessons.map(lesson => ({
              course_id: course.id,
              title: lesson.title,
              duration: lesson.duration,
              id: uuidv4()
            }))
          );
        }
        
        // Insert requirements
        if (course.requirements && course.requirements.length > 0) {
          await supabase.from('course_requirements').insert(
            course.requirements.map(req => ({
              course_id: course.id,
              requirement: req,
              id: uuidv4()
            }))
          );
        }
        
        // Insert outcomes
        if (course.outcomes && course.outcomes.length > 0) {
          await supabase.from('course_outcomes').insert(
            course.outcomes.map(outcome => ({
              course_id: course.id,
              outcome: outcome,
              id: uuidv4()
            }))
          );
        }
        
        successCount++;
      } catch (error) {
        console.error(`Error processing course ${course.id}:`, error);
        failCount++;
      }
    }
    
    // Show a toast with the results
    if (failCount === 0 && successCount > 0) {
      // All courses synced successfully
      toast.success(`${successCount} դասընթաց հաջողությամբ համաժամեցվել է:`);
      // Clear the local courses since they've been synced
      localStorage.removeItem('professional_courses');
      return true;
    } else if (successCount > 0) {
      // Some courses synced, some failed
      toast.warning(`${successCount} դասընթաց համաժամեցվել է, ${failCount} դասընթաց չի համաժամեցվել:`);
      return false;
    } else {
      // All courses failed to sync
      toast.error(`Համաժամեցումը ձախողվել է: ${failCount} դասընթաց չի համաժամեցվել:`);
      return false;
    }
  } catch (error) {
    console.error('Error during course synchronization:', error);
    toast.error('Դասընթացների համաժամեցման ժամանակ սխալ է տեղի ունեցել:');
    return false;
  }
};

/**
 * Loads courses from localStorage
 */
export const loadCoursesFromLocalStorage = (): ProfessionalCourse[] => {
  try {
    const localCoursesJson = localStorage.getItem('professional_courses');
    if (!localCoursesJson) {
      return [];
    }
    
    return JSON.parse(localCoursesJson);
  } catch (error) {
    console.error('Error loading courses from localStorage:', error);
    return [];
  }
};
