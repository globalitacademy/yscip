
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Course } from '../types';
import { supabase } from '@/integrations/supabase/client';

export const useCourseData = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const mapDatabaseCoursesToUI = (data: any[]): Course[] => {
    return data.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description || '',
      specialization: course.specialization || undefined,
      duration: course.duration,
      modules: course.modules || [],
      createdBy: course.created_by || 'unknown',
      color: course.color,
      button_text: course.button_text,
      icon_name: course.icon_name,
      subtitle: course.subtitle,
      price: course.price,
      image_url: course.image_url,
      institution: course.institution,
      is_persistent: course.is_persistent
    }));
  };

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*');

      if (error) {
        throw error;
      }

      const mappedCourses = mapDatabaseCoursesToUI(data);
      setCourses(mappedCourses);
      
      // Save to localStorage as fallback
      localStorage.setItem('courses', JSON.stringify(mappedCourses));
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Չհաջողվեց ստանալ կուրսերի տվյալները');
      
      // Load courses from localStorage as fallback
      const storedCourses = localStorage.getItem('courses');
      if (storedCourses) {
        try {
          setCourses(JSON.parse(storedCourses));
        } catch (e) {
          console.error('Error parsing stored courses:', e);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and set up real-time subscription
  useEffect(() => {
    fetchCourses();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'courses'
        },
        (payload) => {
          console.log('Realtime update received:', payload);
          fetchCourses(); // Refresh the courses when any change occurs
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    courses,
    isLoading,
    refreshCourses: fetchCourses
  };
};
