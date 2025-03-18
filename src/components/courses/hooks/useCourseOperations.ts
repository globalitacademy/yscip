
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

    const courseId = uuidv4();
    
    const courseToAdd = {
      id: courseId,
      title: newCourse.title,
      description: newCourse.description,
      specialization: newCourse.specialization,
      duration: newCourse.duration,
      price: newCourse.price,
      institution: newCourse.institution || 'Qolej',
      subtitle: newCourse.subtitle || 'ԴԱՍԸՆԹԱՑ',
      created_by: user?.id || 'admin',
      color: 'text-amber-500', // Default color
      icon_name: 'code',       // Default icon
      button_text: 'Դիտել'
    };

    try {
      const { error } = await supabase
        .from('courses')
        .insert(courseToAdd);
      
      if (error) throw error;
      
      if (newCourse.modules && newCourse.modules.length > 0) {
        const { error: modulesError } = await supabase
          .from('courses')
          .update({ modules: newCourse.modules })
          .eq('id', courseId);
          
        if (modulesError) {
          console.error('Error adding modules:', modulesError);
          // Continue anyway since the course was created
        }
      }
      
      toast.success('Դասընթացը հաջողությամբ ավելացվել է');
      
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
      
      window.location.reload();
    } catch (error) {
      console.error('Error adding course:', error);
      toast.error('Չհաջողվեց ավելացնել դասընթացը');
    }
  };

  const handleEditCourse = async () => {
    if (!selectedCourse) return;
    
    if (!selectedCourse.title || !selectedCourse.description || !selectedCourse.duration || !selectedCourse.price) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
      return;
    }

    try {
      const { error } = await supabase
        .from('courses')
        .update({
          title: selectedCourse.title,
          description: selectedCourse.description,
          specialization: selectedCourse.specialization,
          duration: selectedCourse.duration,
          price: selectedCourse.price,
          institution: selectedCourse.institution,
          modules: selectedCourse.modules,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedCourse.id);
        
      if (error) throw error;
      
      toast.success('Դասընթացը հաջողությամբ թարմացվել է');
      setIsEditDialogOpen(false);
      
      window.location.reload();
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Չհաջողվեց թարմացնել դասընթացը');
    }
  };

  const handleDeleteCourse = async (id: string) => {
    const courseToDelete = courses.find(course => course.id === id);
    
    if (courseToDelete && (user?.role === 'admin' || courseToDelete.createdBy === user?.id)) {
      try {
        const { error } = await supabase
          .from('courses')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        toast.success('Դասընթացը հաջողությամբ հեռացվել է');
        
        window.location.reload();
      } catch (error) {
        console.error('Error deleting course:', error);
        toast.error('Չհաջողվեց հեռացնել դասընթացը');
      }
    } else {
      toast.error('Դուք չունեք իրավունք ջնջելու այս դասընթացը');
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
