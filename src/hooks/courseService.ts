
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { useCourseDeletion } from './courseService/useCourseDeletion';
import { useCourseUpdating } from './courseService/useCourseUpdating';
import { convertIconNameToComponent } from '@/utils/iconUtils';

export const useCourseService = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const { deleteCourse } = useCourseDeletion(setLoading);
  const { updateCourse } = useCourseUpdating(setLoading);

  // Fetch all courses from database with optimized queries
  const fetchAllCourses = useCallback(async (): Promise<ProfessionalCourse[]> => {
    setLoading(true);
    setError(null);
    
    try {
      console.info('Fetching all courses with optimized method');
      
      // Get all courses
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (coursesError) throw coursesError;
      
      // First prepare the course IDs to use in subsequent queries
      const courseIds = courses.map(course => course.id);
      
      if (courseIds.length === 0) {
        console.info('No courses found');
        return [];
      }
      
      // Get all related data in parallel
      const [lessonsResult, requirementsResult, outcomesResult] = await Promise.all([
        supabase.from('course_lessons').select('*').in('course_id', courseIds),
        supabase.from('course_requirements').select('*').in('course_id', courseIds),
        supabase.from('course_outcomes').select('*').in('course_id', courseIds)
      ]);
      
      // Handle any errors
      if (lessonsResult.error) console.error('Error fetching lessons:', lessonsResult.error);
      if (requirementsResult.error) console.error('Error fetching requirements:', requirementsResult.error);
      if (outcomesResult.error) console.error('Error fetching outcomes:', outcomesResult.error);
      
      // Group related data by course id for easier mapping
      const lessonsMap: Record<string, any[]> = {};
      const requirementsMap: Record<string, string[]> = {};
      const outcomesMap: Record<string, string[]> = {};
      
      // Process lessons
      (lessonsResult.data || []).forEach(lesson => {
        if (!lessonsMap[lesson.course_id]) lessonsMap[lesson.course_id] = [];
        lessonsMap[lesson.course_id].push({
          title: lesson.title,
          duration: lesson.duration
        });
      });
      
      // Process requirements
      (requirementsResult.data || []).forEach(req => {
        if (!requirementsMap[req.course_id]) requirementsMap[req.course_id] = [];
        requirementsMap[req.course_id].push(req.requirement);
      });
      
      // Process outcomes
      (outcomesResult.data || []).forEach(outcome => {
        if (!outcomesMap[outcome.course_id]) outcomesMap[outcome.course_id] = [];
        outcomesMap[outcome.course_id].push(outcome.outcome);
      });
      
      // Map courses to ProfessionalCourse type
      const transformedCourses: ProfessionalCourse[] = courses.map(course => {
        // Generate the icon component from the icon name
        const iconComponent = convertIconNameToComponent(course.icon_name);
        
        return {
          id: course.id,
          title: course.title,
          subtitle: course.subtitle,
          duration: course.duration,
          price: course.price,
          color: course.color,
          institution: course.institution,
          createdBy: course.created_by,
          buttonText: course.button_text,
          iconName: course.icon_name,
          // Add the icon component which was missing
          icon: iconComponent,
          description: course.description,
          is_public: course.is_public,
          imageUrl: course.image_url,
          organizationLogo: course.organization_logo,
          createdAt: course.created_at,
          lessons: lessonsMap[course.id] || [],
          requirements: requirementsMap[course.id] || [],
          outcomes: outcomesMap[course.id] || [],
          slug: course.slug
        };
      });
      
      console.info(`Successfully loaded ${transformedCourses.length} courses`);
      return transformedCourses;
      
    } catch (err: any) {
      console.error('Error in fetchAllCourses:', err);
      setError(err.message || 'Դասընթացների բեռնման ժամանակ սխալ է տեղի ունեցել');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fetchAllCourses,
    updateCourse,
    deleteCourse,
    loading,
    error
  };
};
