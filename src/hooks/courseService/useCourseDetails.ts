
import { useState, useEffect, useCallback } from 'react';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { convertIconNameToComponent } from '@/utils/iconUtils';

export const useCourseDetails = (id: string | undefined) => {
  const [course, setCourse] = useState<ProfessionalCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [editedCourse, setEditedCourse] = useState<Partial<ProfessionalCourse>>({});
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Reset editedCourse whenever course changes to ensure consistent state
  useEffect(() => {
    if (course) {
      console.log('Course data changed, updating editedCourse with:', course);
      setEditedCourse(JSON.parse(JSON.stringify(course))); // Deep copy to avoid reference issues
    }
  }, [course]);

  // Function to fetch course details
  const fetchCourse = useCallback(async () => {
    if (!id) {
      console.log('No course ID provided, skipping fetch');
      setLoading(false);
      return;
    }
    
    console.log('Fetching course with ID:', id);
    setLoading(true);
    setFetchError(null);
    
    try {
      // Fetch main course data
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('Error fetching course:', error);
        setFetchError(error.message);
        toast.error('Դասընթացի բեռնման ժամանակ սխալ է տեղի ունեցել');
        return;
      }
      
      if (!data) {
        console.error('Course not found with ID:', id);
        setFetchError('Course not found');
        toast.error('Դասընթացը չի գտնվել');
        return;
      }
      
      console.log('Successfully fetched main course data:', data);
      
      // Fetch related data in parallel for better performance
      const [lessonsResult, requirementsResult, outcomesResult] = await Promise.all([
        supabase.from('course_lessons').select('*').eq('course_id', id),
        supabase.from('course_requirements').select('*').eq('course_id', id),
        supabase.from('course_outcomes').select('*').eq('course_id', id)
      ]);
      
      console.log('Fetched related data:', {
        lessons: lessonsResult.data,
        requirements: requirementsResult.data,
        outcomes: outcomesResult.data
      });
      
      // Create icon component
      const iconElement = convertIconNameToComponent(data.icon_name);
      
      // Construct complete course object with all related data
      const professionalCourse: ProfessionalCourse = {
        id: data.id,
        title: data.title,
        subtitle: data.subtitle || 'ԴԱՍԸՆԹԱՑ',
        icon: iconElement,
        iconName: data.icon_name,
        duration: data.duration,
        price: data.price,
        buttonText: data.button_text || 'Դիտել',
        color: data.color || 'text-amber-500',
        createdBy: data.created_by || '',
        institution: data.institution || 'ՀՊՏՀ',
        imageUrl: data.image_url,
        organizationLogo: data.organization_logo,
        description: data.description || '',
        is_public: data.is_public || false,
        instructor: data.instructor || '',
        lessons: lessonsResult.data?.map(lesson => ({
          title: lesson.title,
          duration: lesson.duration
        })) || [],
        requirements: requirementsResult.data?.map(req => req.requirement) || [],
        outcomes: outcomesResult.data?.map(outcome => outcome.outcome) || [],
        slug: data.slug || ''
      };
      
      console.log('Created complete course object:', professionalCourse);
      
      // Update state with fetched data
      setCourse(professionalCourse);
      setEditedCourse(JSON.parse(JSON.stringify(professionalCourse))); // Deep copy
    } catch (e) {
      console.error('Unexpected error fetching course details:', e);
      setFetchError(e instanceof Error ? e.message : 'Unknown error');
      toast.error('Դասընթացի բեռնման ժամանակ սխալ է տեղի ունեցել');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Initialize data loading
  useEffect(() => {
    fetchCourse();
    
    if (id) {
      // Setup realtime subscription to get updates to this course
      console.log('Setting up realtime subscription for course ID:', id);
      const channel = supabase
        .channel(`course-${id}-changes`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'courses',
            filter: `id=eq.${id}`
          },
          (payload) => {
            console.log('Received realtime update for course:', payload);
            fetchCourse();
          }
        )
        .subscribe();
        
      return () => {
        console.log('Cleaning up realtime subscription for course ID:', id);
        supabase.removeChannel(channel);
      };
    }
  }, [id, fetchCourse]);

  return {
    course,
    setCourse,
    loading,
    fetchCourse,
    editedCourse,
    setEditedCourse,
    fetchError
  };
};
