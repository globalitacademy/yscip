
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Course } from '../types';
import { useAuth } from '@/contexts/AuthContext';
import { Dispatch, SetStateAction } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const mockSpecializations = ['Ծրագրավորում', 'Տվյալագիտություն', 'Դիզայն', 'Մարկետինգ', 'Բիզնես վերլուծություն'];

export const useCourseOperations = (
  courses: Course[],
  setIsAddDialogOpen: Dispatch<SetStateAction<boolean>>,
  setIsEditDialogOpen: Dispatch<SetStateAction<boolean>>,
  newCourse: Partial<Course>,
  setNewCourse: Dispatch<SetStateAction<Partial<Course>>>,
  selectedCourse: Course | null
) => {
  const { user } = useAuth();

  const handleAddCourse = async () => {
    if (!newCourse.title || !newCourse.description || !newCourse.duration || !newCourse.price) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
      return;
    }

    try {
      const courseToAdd = {
        title: newCourse.title,
        description: newCourse.description,
        specialization: newCourse.specialization || '',
        duration: newCourse.duration,
        price: newCourse.price,
        institution: newCourse.institution || 'Qolej',
        subtitle: newCourse.subtitle || 'ԴԱՍԸՆԹԱՑ',
        icon_name: newCourse.icon_name || 'Code',
        button_text: 'Դիտել',
        created_by: user?.id || '',
        color: 'text-amber-500',
        modules: newCourse.modules || []
      };

      console.log('Attempting to create course:', courseToAdd);
      
      const { data, error } = await supabase
        .from('courses')
        .insert(courseToAdd)
        .select();
      
      if (error) {
        console.error('Supabase error inserting course:', error);
        throw error;
      }
      
      console.log('Course created successfully:', data);
      
      toast.success('Դասընթացը հաջողությամբ ավելացվել է');
      
      // Reset form and close dialog
      setNewCourse({
        title: '',
        description: '',
        specialization: '',
        duration: '',
        modules: [],
        createdBy: user?.id || '',
        price: '',
        institution: 'Qolej',
        subtitle: 'ԴԱՍԸՆԹԱՑ'
      });
      setIsAddDialogOpen(false);
      
      // Refresh the page to show the new course
      window.location.reload();
    } catch (error) {
      console.error('Error adding course:', error);
      toast.error('Չհաջողվեց ավելացնել դասընթացը');
    }
  };

  const handleEditCourse = async () => {
    if (!selectedCourse) return;
    
    if (!selectedCourse.title || !selectedCourse.description || !selectedCourse.duration) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
      return;
    }

    try {
      console.log('Updating course:', selectedCourse);
      
      const { error } = await supabase
        .from('courses')
        .update({
          title: selectedCourse.title,
          description: selectedCourse.description,
          specialization: selectedCourse.specialization || null,
          duration: selectedCourse.duration,
          price: selectedCourse.price || '0',
          institution: selectedCourse.institution || null,
          modules: selectedCourse.modules || [],
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedCourse.id);
        
      if (error) {
        console.error('Supabase error updating course:', error);
        throw error;
      }
      
      console.log('Course updated successfully');
      
      toast.success('Դասընթացը հաջողությամբ թարմացվել է');
      setIsEditDialogOpen(false);
      
      // Refresh the page to show updated course data
      window.location.reload();
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Չհաջողվեց թարմացնել դասընթացը');
    }
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      console.log('Deleting course with ID:', id);
      
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);
          
      if (error) {
        console.error('Supabase error deleting course:', error);
        throw error;
      }
      
      console.log('Course deleted successfully');
      
      toast.success('Դասընթացը հաջողությամբ հեռացվել է');
      
      // Refresh the page to update the course list
      window.location.reload();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Չհաջողվեց հեռացնել դասընթացը');
    }
  };

  const handleEditInit = (course: Course) => {
    return {
      ...course
    };
  };

  return {
    handleAddCourse,
    handleEditCourse,
    handleEditInit,
    handleDeleteCourse
  };
};
