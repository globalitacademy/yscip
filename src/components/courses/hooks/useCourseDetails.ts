
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Course } from '@/components/courses/types';
import { useForm } from 'react-hook-form';
import { CourseFormValues } from '@/components/courses/CourseDetails/CourseEditForm';

export const useCourseDetails = (courseId: string | undefined) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<CourseFormValues>({
    defaultValues: {
      title: '',
      subtitle: '',
      description: '',
      duration: '',
      price: '',
      specialization: '',
      institution: '',
    },
  });

  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      try {
        if (!courseId) {
          throw new Error('Course ID is required');
        }
        
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('id', courseId)
          .single();

        if (error) {
          throw error;
        }

        const fetchedCourse = {
          id: data.id,
          title: data.title,
          description: data.description || '',
          specialization: data.specialization || undefined,
          duration: data.duration,
          modules: data.modules || [],
          createdBy: data.created_by || 'unknown',
          color: data.color,
          button_text: data.button_text,
          icon_name: data.icon_name,
          subtitle: data.subtitle,
          price: data.price,
          image_url: data.image_url,
          institution: data.institution,
          is_persistent: data.is_persistent
        };

        setCourse(fetchedCourse);
        
        // Initialize form with course data
        form.reset({
          title: fetchedCourse.title,
          subtitle: fetchedCourse.subtitle || '',
          description: fetchedCourse.description,
          duration: fetchedCourse.duration,
          price: fetchedCourse.price || '',
          specialization: fetchedCourse.specialization || '',
          institution: fetchedCourse.institution || '',
        });
      } catch (err) {
        console.error('Error fetching course details:', err);
        setError('Չհաջողվեց բեռնել դասընթացի մանրամասները');
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId, form]);

  const updateCourse = async (values: CourseFormValues): Promise<boolean> => {
    try {
      if (!courseId || !course) return false;
      
      const { error } = await supabase
        .from('courses')
        .update({
          title: values.title,
          subtitle: values.subtitle || 'ԴԱՍԸՆԹԱՑ',
          description: values.description,
          duration: values.duration,
          price: values.price,
          specialization: values.specialization || null,
          institution: values.institution || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', courseId);

      if (error) throw error;

      // Update local course data
      setCourse({
        ...course,
        title: values.title,
        subtitle: values.subtitle || 'ԴԱՍԸՆԹԱՑ',
        description: values.description,
        duration: values.duration,
        price: values.price,
        specialization: values.specialization,
        institution: values.institution,
      });

      return true;
    } catch (err) {
      console.error('Error updating course:', err);
      return false;
    }
  };

  return {
    course,
    isLoading,
    error,
    form,
    updateCourse,
  };
};
