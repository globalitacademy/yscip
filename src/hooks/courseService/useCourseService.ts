
import { useState, useCallback } from 'react';
import { useCourseFetching } from './useCourseFetching';
import { useCourseCreation } from './useCourseCreation';
import { useCourseUpdating } from './useCourseUpdating';
import { useCourseDeletion } from './useCourseDeletion';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { convertIconNameToComponent } from '@/utils/iconUtils';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook for handling all course-related database operations
 */
export const useCourseService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  const { fetchCourses } = useCourseFetching(setLoading);
  const { createCourse } = useCourseCreation(setLoading);
  const { updateCourse } = useCourseUpdating(setLoading, setError);
  const { deleteCourse } = useCourseDeletion(setLoading);
  
  /**
   * Optimized method to fetch all courses with related data in a single operation
   */
  const fetchAllCourses = useCallback(async (): Promise<ProfessionalCourse[]> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching all courses with optimized method");
      
      // Build the query based on user role
      let query = supabase.from('courses').select('*');
      
      // If user is not admin, filter by public courses or created_by
      if (user && user.role !== 'admin') {
        query = query.or(`is_public.eq.true,created_by.eq.${user.name}`);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching courses:", error);
        setError(`Դասընթացների բեռնման ժամանակ սխալ: ${error.message}`);
        toast.error("Դասընթացների բեռնման ժամանակ սխալ է տեղի ունեցել");
        return [];
      }
      
      if (!data || data.length === 0) {
        console.log("No courses found");
        return [];
      }
      
      // Get all course IDs to fetch related data
      const courseIds = data.map(course => course.id);
      
      // Fetch all related data in parallel
      const [lessonsResult, requirementsResult, outcomesResult] = await Promise.all([
        supabase.from('course_lessons').select('*').in('course_id', courseIds),
        supabase.from('course_requirements').select('*').in('course_id', courseIds),
        supabase.from('course_outcomes').select('*').in('course_id', courseIds)
      ]);
      
      // Group related data by course_id for faster lookup
      const lessonsByCourseId: Record<string, any[]> = {};
      const requirementsByCourseId: Record<string, any[]> = {};
      const outcomesByCourseId: Record<string, any[]> = {};
      
      lessonsResult.data?.forEach(lesson => {
        if (!lessonsByCourseId[lesson.course_id]) {
          lessonsByCourseId[lesson.course_id] = [];
        }
        lessonsByCourseId[lesson.course_id].push(lesson);
      });
      
      requirementsResult.data?.forEach(req => {
        if (!requirementsByCourseId[req.course_id]) {
          requirementsByCourseId[req.course_id] = [];
        }
        requirementsByCourseId[req.course_id].push(req);
      });
      
      outcomesResult.data?.forEach(outcome => {
        if (!outcomesByCourseId[outcome.course_id]) {
          outcomesByCourseId[outcome.course_id] = [];
        }
        outcomesByCourseId[outcome.course_id].push(outcome);
      });
      
      // Map courses with their related data
      const completeCourses = data.map(course => {
        const iconElement = convertIconNameToComponent(course.icon_name);
        
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
          instructor: course.instructor || '',
          lessons: (lessonsByCourseId[course.id] || []).map(lesson => ({
            title: lesson.title, 
            duration: lesson.duration
          })),
          requirements: (requirementsByCourseId[course.id] || []).map(req => req.requirement),
          outcomes: (outcomesByCourseId[course.id] || []).map(outcome => outcome.outcome),
          slug: course.slug || '',
          createdAt: course.created_at
        } as ProfessionalCourse;
      });
      
      console.log(`Successfully loaded ${completeCourses.length} courses`);
      return completeCourses;
    } catch (err: any) {
      console.error("Error in fetchAllCourses:", err);
      setError(`Դասընթացների բեռնման ժամանակ սխալ: ${err.message}`);
      toast.error("Դասընթացների բեռնման ժամանակ սխալ է տեղի ունեցել");
      return [];
    } finally {
      setLoading(false);
    }
  }, [user, setLoading, setError]);

  return {
    fetchCourses,
    fetchAllCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    loading,
    error
  };
};
