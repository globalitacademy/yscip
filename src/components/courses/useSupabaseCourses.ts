import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Course } from './types';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*');

      if (error) {
        throw error;
      }

      // Map the database courses to our Course type
      const mappedCourses: Course[] = data.map((course) => ({
        id: course.id,
        title: course.title,
        description: course.description || '',
        specialization: undefined,
        duration: course.duration,
        modules: [],
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

      setCourses(mappedCourses);
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

  // Get user's courses
  const getUserCourses = () => {
    if (!user) return [];
    return courses.filter(course => course.createdBy === user.id);
  };

  const addCourse = async (newCourse: Omit<Course, 'id' | 'createdBy'>) => {
    if (!user) {
      toast.error('Պետք է մուտք գործեք համակարգ՝ կուրս ավելացնելու համար');
      return false;
    }

    try {
      // Convert to the Supabase table format
      const courseToAdd = {
        title: newCourse.title,
        description: newCourse.description,
        duration: newCourse.duration,
        created_by: user.id,
        color: 'text-amber-500', // Default color
        icon_name: 'Book', // Default icon
        price: '0', // Default price
        subtitle: 'ԴԱՍԸՆԹԱՑ' // Default subtitle
      };

      const { data, error } = await supabase
        .from('courses')
        .insert(courseToAdd)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Add the new course to state
      const addedCourse: Course = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        specialization: undefined,
        duration: data.duration,
        modules: [],
        createdBy: data.created_by,
        color: data.color,
        button_text: data.button_text,
        icon_name: data.icon_name,
        subtitle: data.subtitle,
        price: data.price,
        image_url: data.image_url,
        institution: data.institution,
        is_persistent: data.is_persistent
      };

      setCourses(prevCourses => [...prevCourses, addedCourse]);
      toast.success('Կուրսը հաջողությամբ ավելացվել է');
      return true;
    } catch (error) {
      console.error('Error adding course:', error);
      toast.error('Չհաջողվեց ավելացնել կուրսը');
      return false;
    }
  };

  const updateCourse = async (courseId: string, updatedData: Partial<Course>) => {
    if (!user) {
      toast.error('Պետք է մուտք գործեք համակարգ՝ կուրսը խմբագրելու համար');
      return false;
    }

    try {
      // Convert to the Supabase table format
      const courseUpdate = {
        title: updatedData.title,
        description: updatedData.description,
        duration: updatedData.duration,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('courses')
        .update(courseUpdate)
        .eq('id', courseId);

      if (error) {
        throw error;
      }

      // Update course in state
      setCourses(prevCourses => 
        prevCourses.map(course => 
          course.id === courseId 
            ? { ...course, ...updatedData } 
            : course
        )
      );

      toast.success('Կուրսը հաջողությամբ թարմացվել է');
      return true;
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Չհաջողվեց թարմացնել կուրսը');
      return false;
    }
  };

  const deleteCourse = async (courseId: string) => {
    if (!user) {
      toast.error('Պետք է մուտք գործեք համակարգ՝ կուրսը ջնջելու համար');
      return false;
    }

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) {
        throw error;
      }

      // Remove course from state
      setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
      toast.success('Կուրսը հաջողությամբ հեռացվել է');
      return true;
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Չհաջողվեց հեռացնել կուրսը');
      return false;
    }
  };

  // Set up real-time subscription to course changes
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
    userCourses: getUserCourses(),
    isLoading,
    addCourse,
    updateCourse: async () => true,
    deleteCourse: async () => true,
    refreshCourses: fetchCourses
  };
};
