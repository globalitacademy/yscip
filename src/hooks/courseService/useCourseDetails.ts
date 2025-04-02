
import { useState, useEffect } from 'react';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { convertIconNameToComponent } from '@/utils/iconUtils';

export const useCourseDetails = (id: string | undefined) => {
  const [course, setCourse] = useState<ProfessionalCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [editedCourse, setEditedCourse] = useState<Partial<ProfessionalCourse>>({});

  useEffect(() => {
    // Reset editedCourse whenever course changes
    if (course) {
      setEditedCourse(JSON.parse(JSON.stringify(course))); // Deep copy to avoid reference issues
    }
  }, [course]);

  // Function to fetch course details
  const fetchCourse = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      console.log('Fetching course with ID:', id);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('Error fetching course:', error);
        toast.error('Դասընթացի բեռնման ժամանակ սխալ է տեղի ունեցել');
        return;
      }
      
      if (!data) {
        toast.error('Դասընթացը չի գտնվել');
        return;
      }
      
      const { data: lessonsData } = await supabase
        .from('course_lessons')
        .select('*')
        .eq('course_id', id);
        
      const { data: requirementsData } = await supabase
        .from('course_requirements')
        .select('*')
        .eq('course_id', id);
        
      const { data: outcomesData } = await supabase
        .from('course_outcomes')
        .select('*')
        .eq('course_id', id);
      
      const iconElement = convertIconNameToComponent(data.icon_name);
      
      const professionalCourse: ProfessionalCourse = {
        id: data.id,
        title: data.title,
        subtitle: data.subtitle,
        icon: iconElement,
        iconName: data.icon_name,
        duration: data.duration,
        price: data.price,
        buttonText: data.button_text,
        color: data.color,
        createdBy: data.created_by,
        institution: data.institution,
        imageUrl: data.image_url,
        organizationLogo: data.organization_logo,
        description: data.description,
        is_public: data.is_public,
        lessons: lessonsData?.map(lesson => ({
          title: lesson.title,
          duration: lesson.duration
        })) || [],
        requirements: requirementsData?.map(req => req.requirement) || [],
        outcomes: outcomesData?.map(outcome => outcome.outcome) || [],
        slug: data.slug
      };
      
      setCourse(professionalCourse);
      setEditedCourse(JSON.parse(JSON.stringify(professionalCourse))); // Deep copy
      console.log('Fetched course:', professionalCourse);
    } catch (e) {
      console.error('Error fetching course details:', e);
      toast.error('Դասընթացի բեռնման ժամանակ սխալ է տեղի ունեցել');
    } finally {
      setLoading(false);
    }
  };

  // Initialize data loading
  useEffect(() => {
    fetchCourse();
    
    if (id) {
      const channel = supabase
        .channel('course-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'courses',
            filter: `id=eq.${id}`
          },
          () => {
            fetchCourse();
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [id]);

  return {
    course,
    setCourse,
    loading,
    fetchCourse,
    editedCourse,
    setEditedCourse
  };
};
