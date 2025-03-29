
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { syncLocalCoursesToDatabase } from '@/utils/syncUtils';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { convertIconNameToComponent } from '@/utils/iconUtils';
import { toast } from 'sonner';

export const useCourseDataLoading = (
  setProfessionalCourses: React.Dispatch<React.SetStateAction<ProfessionalCourse[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [lastLoadTime, setLastLoadTime] = useState<number>(0);
  
  /**
   * Load courses from Supabase database
   */
  const loadCoursesFromDatabase = useCallback(async (): Promise<boolean> => {
    // Prevent multiple rapid loading attempts
    const now = Date.now();
    if (now - lastLoadTime < 1000) {
      return false; // Debounce: don't load if less than 1 second has passed
    }
    
    setLastLoadTime(now);
    setLoading(true);
    
    try {
      console.log("Loading courses from database");
      
      // First, try to sync any local courses to the database
      await syncLocalCoursesToDatabase();
      
      // Load courses from Supabase
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching courses from Supabase:", error);
        toast.error("Դասընթացների բեռնման ժամանակ սխալ է տեղի ունեցել");
        return false;
      }
      
      // If there are courses, fetch additional details for each
      if (data && data.length > 0) {
        // Process each course to include related data
        const coursesWithDetails = await Promise.all(data.map(async (course) => {
          // Fetch lessons, requirements, and outcomes in parallel
          const [lessonsResponse, requirementsResponse, outcomesResponse] = await Promise.all([
            supabase.from('course_lessons').select('*').eq('course_id', course.id),
            supabase.from('course_requirements').select('*').eq('course_id', course.id),
            supabase.from('course_outcomes').select('*').eq('course_id', course.id)
          ]);
          
          // Create icon component
          const iconElement = convertIconNameToComponent(course.icon_name);
          
          // Return the complete course object
          return {
            id: course.id,
            title: course.title,
            subtitle: course.subtitle || 'ԴԱՍԸՆԹԱՑ',
            icon: iconElement,
            iconName: course.icon_name,
            duration: course.duration,
            price: course.price,
            buttonText: course.button_text || 'Դիտել',
            color: course.color || 'text-amber-500',
            createdBy: course.created_by || '',
            institution: course.institution || 'ՀՊՏՀ',
            imageUrl: course.image_url,
            organizationLogo: course.organization_logo,
            description: course.description || '',
            is_public: course.is_public || false,
            lessons: lessonsResponse.data?.map(lesson => ({
              title: lesson.title, 
              duration: lesson.duration
            })) || [],
            requirements: requirementsResponse.data?.map(req => req.requirement) || [],
            outcomes: outcomesResponse.data?.map(outcome => outcome.outcome) || [],
            slug: course.slug || '',
            createdAt: course.created_at,
            updatedAt: course.updated_at
          } as ProfessionalCourse;
        }));
        
        console.log("Loaded courses from database:", coursesWithDetails.length);
        setProfessionalCourses(coursesWithDetails);
        return true;
      } else {
        console.log("No courses found in database");
        setProfessionalCourses([]);
        return true;
      }
    } catch (error) {
      console.error("Error in loadCoursesFromDatabase:", error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [lastLoadTime, setProfessionalCourses, setLoading]);
  
  /**
   * Load courses from localStorage (as a fallback)
   */
  const loadCoursesFromLocalStorage = useCallback(async (): Promise<boolean> => {
    try {
      const storedCourses = localStorage.getItem('professional_courses');
      if (storedCourses) {
        const courses = JSON.parse(storedCourses) as ProfessionalCourse[];
        if (courses.length > 0) {
          // Process courses to ensure icons are properly created
          const processedCourses = courses.map(course => ({
            ...course,
            icon: convertIconNameToComponent(course.iconName || 'book')
          }));
          
          console.log("Loaded courses from localStorage:", processedCourses.length);
          setProfessionalCourses(processedCourses);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error loading courses from localStorage:", error);
      return false;
    }
  }, [setProfessionalCourses]);
  
  /**
   * Synchronize courses with database
   */
  const syncCoursesWithDatabase = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    try {
      // First sync any pending courses
      const success = await syncLocalCoursesToDatabase();
      
      // Then reload from the database
      await loadCoursesFromDatabase();
      
      return success;
    } catch (error) {
      console.error("Error in syncCoursesWithDatabase:", error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadCoursesFromDatabase, setLoading]);
  
  return {
    loadCoursesFromDatabase,
    loadCoursesFromLocalStorage,
    syncCoursesWithDatabase
  };
};
