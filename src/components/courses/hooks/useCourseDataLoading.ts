
import { Dispatch, SetStateAction } from 'react';
import { ProfessionalCourse } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { convertIconNameToComponent } from '@/utils/iconUtils';
import { loadCoursesFromLocalStorage as loadFromLocalStorage, syncLocalCoursesToDatabase } from '@/utils/syncUtils';

/**
 * Hook that provides functions for loading and managing course data
 */
export const useCourseDataLoading = (
  setProfessionalCourses: Dispatch<SetStateAction<ProfessionalCourse[]>>,
  setLoading: Dispatch<SetStateAction<boolean>>
) => {
  /**
   * Loads courses from localStorage and merges them with the state
   */
  const loadCoursesFromLocalStorage = async (): Promise<void> => {
    try {
      const localCourses = loadFromLocalStorage();
      
      if (localCourses.length > 0) {
        setProfessionalCourses(prev => {
          // Create a map of existing courses by ID
          const existingCoursesMap = new Map(prev.map(course => [course.id, course]));
          
          // Add local courses that don't exist in the current state
          localCourses.forEach(localCourse => {
            if (!existingCoursesMap.has(localCourse.id)) {
              existingCoursesMap.set(localCourse.id, localCourse);
            }
          });
          
          // Convert map back to array
          return Array.from(existingCoursesMap.values());
        });
      }
    } catch (error) {
      console.error('Error loading courses from localStorage:', error);
    }
  };

  /**
   * Loads courses from the Supabase database
   */
  const loadCoursesFromDatabase = async (): Promise<boolean> => {
    setLoading(true);
    try {
      // Fetch courses from the database
      const { data, error } = await supabase
        .from('courses')
        .select('*');
      
      if (error) {
        console.error('Error fetching courses:', error);
        
        // Load from localStorage as fallback
        await loadCoursesFromLocalStorage();
        
        if (error.code === '42P17' || error.message.includes('policy') || error.message.includes('recursion')) {
          toast.warning('Տվյալների բազայից դասընթացների բեռնումը անհաջող էր: Տեղական տվյալները կօգտագործվեն:');
        } else {
          toast.error(`Դասընթացների բեռնման սխալ: ${error.message}`);
        }
        
        setLoading(false);
        return false;
      }
      
      // If no courses returned, just set empty array
      if (!data || data.length === 0) {
        setProfessionalCourses([]);
        setLoading(false);
        return true;
      }
      
      // Process each course to include lessons, requirements, and outcomes
      const completeCourses = await Promise.all(data.map(async (course) => {
        // Fetch additional data for each course
        const [lessonsResult, requirementsResult, outcomesResult] = await Promise.all([
          supabase.from('course_lessons').select('*').eq('course_id', course.id),
          supabase.from('course_requirements').select('*').eq('course_id', course.id),
          supabase.from('course_outcomes').select('*').eq('course_id', course.id)
        ]);
        
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
          is_public: course.is_public,
          lessons: lessonsResult.data?.map(lesson => ({
            title: lesson.title, 
            duration: lesson.duration
          })) || [],
          requirements: requirementsResult.data?.map(req => req.requirement) || [],
          outcomes: outcomesResult.data?.map(outcome => outcome.outcome) || [],
          createdAt: course.created_at
        } as ProfessionalCourse;
      }));
      
      // Merge with any local courses
      const localCourses = loadFromLocalStorage();
      const localCoursesIds = new Set(localCourses.map(c => c.id));
      
      // Filter out any local courses that exist in the database results
      const uniqueLocalCourses = localCourses.filter(local => 
        !completeCourses.some(remote => remote.id === local.id)
      );
      
      // Combine database and local courses
      const mergedCourses = [...completeCourses, ...uniqueLocalCourses];
      
      setProfessionalCourses(mergedCourses);
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Error in loadCoursesFromDatabase:', error);
      toast.error('Սխալ է տեղի ունեցել դասընթացների տվյալները բեռնելիս։');
      
      // Load from localStorage as fallback
      await loadCoursesFromLocalStorage();
      
      setLoading(false);
      return false;
    }
  };

  /**
   * Synchronizes local courses with the database
   */
  const syncCoursesWithDatabase = async (): Promise<boolean> => {
    setLoading(true);
    try {
      const result = await syncLocalCoursesToDatabase();
      
      // If successful, reload courses from the database
      if (result) {
        await loadCoursesFromDatabase();
      }
      
      return result;
    } catch (error) {
      console.error('Error syncing courses with database:', error);
      toast.error('Դասընթացների համաժամեցման ընթացքում սխալ է տեղի ունեցել։');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loadCoursesFromDatabase,
    syncCoursesWithDatabase,
    loadCoursesFromLocalStorage
  };
};
