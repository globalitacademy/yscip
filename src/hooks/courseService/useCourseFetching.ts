
import { Dispatch, SetStateAction, useCallback } from 'react';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { convertIconNameToComponent } from '@/utils/iconUtils';

export const useCourseFetching = (setLoading: Dispatch<SetStateAction<boolean>>) => {
  const fetchCourses = useCallback(async (): Promise<ProfessionalCourse[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching courses:', error);
        toast.error('Սխալ դասընթացների ստացման ժամանակ');
        return [];
      }
      
      if (!data || data.length === 0) {
        return [];
      }
      
      // Process each course to include related data
      const completeCourses = await Promise.all(data.map(async (course) => {
        // Fetch lessons, requirements, and outcomes
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
          instructor: course.instructor || '', // Make sure to include instructor
          lessons: lessonsResult.data?.map(lesson => ({
            title: lesson.title, 
            duration: lesson.duration
          })) || [],
          requirements: requirementsResult.data?.map(req => req.requirement) || [],
          outcomes: outcomesResult.data?.map(outcome => outcome.outcome) || [],
          slug: course.slug || '',
          createdAt: course.created_at
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
  }, [setLoading]);

  return { fetchCourses };
};
