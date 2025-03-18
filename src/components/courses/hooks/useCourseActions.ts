
import { useState } from 'react';
import { toast } from 'sonner';
import { Course } from '../types';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useCourseActions = () => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const addCourse = async (newCourse: Omit<Course, 'id' | 'createdBy'>) => {
    if (!user) {
      toast.error('Պետք է մուտք գործեք համակարգ՝ կուրս ավելացնելու համար');
      return false;
    }

    setIsProcessing(true);
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

      toast.success('Կուրսը հաջողությամբ ավելացվել է');
      return true;
    } catch (error) {
      console.error('Error adding course:', error);
      toast.error('Չհաջողվեց ավելացնել կուրսը');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const updateCourse = async (courseId: string, updatedData: Partial<Course>) => {
    if (!user) {
      toast.error('Պետք է մուտք գործեք համակարգ՝ կուրսը խմբագրելու համար');
      return false;
    }

    setIsProcessing(true);
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

      toast.success('Կուրսը հաջողությամբ թարմացվել է');
      return true;
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Չհաջողվեց թարմացնել կուրսը');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteCourse = async (courseId: string) => {
    if (!user) {
      toast.error('Պետք է մուտք գործեք համակարգ՝ կուրսը ջնջելու համար');
      return false;
    }

    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) {
        throw error;
      }

      toast.success('Կուրսը հաջողությամբ հեռացվել է');
      return true;
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Չհաջողվեց հեռացնել կուրսը');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    addCourse,
    updateCourse,
    deleteCourse,
    isProcessing
  };
};
