
import { Dispatch, SetStateAction } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProfessionalCourse } from '@/components/courses/types';
import { toast } from 'sonner';
import { convertIconNameToComponent } from '@/utils/iconUtils';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook for fetching course data from the database
 */
export const useCourseFetching = (setLoading: Dispatch<SetStateAction<boolean>>) => {
  const { user } = useAuth();

  /**
   * Fetch all courses from the database
   */
  const fetchCourses = async (): Promise<ProfessionalCourse[]> => {
    setLoading(true);
    try {
      const query = supabase
        .from('courses')
        .select('*');
      
      // If user is not admin, only show public courses and their own courses
      if (user && user.role !== 'admin') {
        query.or(`is_public.eq.true,created_by.eq.${user.name}`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching courses:', error);
        toast.error('Սխալ դասընթացների ստացման ժամանակ, օգտագործվում են լոկալ տվյալները');
        return [];
      }
      
      if (!data || data.length === 0) {
        return [];
      }
      
      // Process each course to include lessons, requirements, and outcomes
      const completeCourses = await Promise.all(data.map(async (course) => {
        const { data: lessonsData } = await supabase
          .from('course_lessons')
          .select('*')
          .eq('course_id', course.id);
        
        const { data: requirementsData } = await supabase
          .from('course_requirements')
          .select('*')
          .eq('course_id', course.id);
        
        const { data: outcomesData } = await supabase
          .from('course_outcomes')
          .select('*')
          .eq('course_id', course.id);
        
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
          lessons: lessonsData?.map(lesson => ({
            title: lesson.title, 
            duration: lesson.duration
          })) || [],
          requirements: requirementsData?.map(req => req.requirement) || [],
          outcomes: outcomesData?.map(outcome => outcome.outcome) || [],
          slug: course.slug
        } as ProfessionalCourse;
      }));
      
      return completeCourses;
    } catch (error) {
      console.error('Error in fetchCourses:', error);
      toast.error('Սխալ է տեղի ունեցել դասընթացների տվյալները բեռնելիս։');
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { fetchCourses };
};
