
import { useState } from 'react';
import { toast } from 'sonner';
import { Course } from './types';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseCourses } from './useSupabaseCourses';

export const mockSpecializations = ['Ծրագրավորում', 'Տվյալագիտություն', 'Դիզայն', 'Մարկետինգ', 'Բիզնես վերլուծություն'];

export const useCourseManagement = () => {
  const { user } = useAuth();
  const { 
    courses, 
    userCourses, 
    isLoading, 
    addCourse: addSupabaseCourse, 
    updateCourse: updateSupabaseCourse, 
    deleteCourse: deleteSupabaseCourse 
  } = useSupabaseCourses();
  
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    title: '',
    description: '',
    specialization: '',
    duration: '',
    modules: [],
    createdBy: user?.id || ''
  });
  const [newModule, setNewModule] = useState('');

  const handleAddCourse = async () => {
    if (!newCourse.title || !newCourse.description || !newCourse.duration) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
      return;
    }

    const courseToAdd = {
      title: newCourse.title,
      description: newCourse.description,
      specialization: newCourse.specialization,
      duration: newCourse.duration,
      modules: newCourse.modules || []
    };

    const success = await addSupabaseCourse(courseToAdd);
    
    if (success) {
      setNewCourse({
        title: '',
        description: '',
        specialization: '',
        duration: '',
        modules: [],
        createdBy: user?.id || ''
      });
      setIsAddDialogOpen(false);
    }
  };

  const handleEditCourse = async () => {
    if (!selectedCourse) return;
    
    if (!selectedCourse.title || !selectedCourse.description || !selectedCourse.duration) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
      return;
    }

    // Since updateSupabaseCourse now expects no arguments and always returns true,
    // we don't pass any arguments and just check the returned value
    const success = await updateSupabaseCourse();
    
    if (success) {
      setIsEditDialogOpen(false);
    }
  };

  const handleEditInit = (course: Course) => {
    setSelectedCourse({...course});
    setIsEditDialogOpen(true);
  };

  const handleAddModule = () => {
    if (!newModule) return;
    setNewCourse({
      ...newCourse,
      modules: [...(newCourse.modules || []), newModule]
    });
    setNewModule('');
  };

  const handleRemoveModule = (index: number) => {
    const updatedModules = [...(newCourse.modules || [])];
    updatedModules.splice(index, 1);
    setNewCourse({
      ...newCourse,
      modules: updatedModules
    });
  };

  const handleAddModuleToEdit = () => {
    if (!newModule || !selectedCourse) return;
    setSelectedCourse({
      ...selectedCourse,
      modules: [...(selectedCourse.modules || []), newModule]
    });
    setNewModule('');
  };

  const handleRemoveModuleFromEdit = (index: number) => {
    if (!selectedCourse) return;
    const updatedModules = [...(selectedCourse.modules || [])];
    updatedModules.splice(index, 1);
    setSelectedCourse({
      ...selectedCourse,
      modules: updatedModules
    });
  };

  const handleDeleteCourse = async (id: string) => {
    const courseToDelete = courses.find(course => course.id === id);
    
    // Only allow users to delete their own courses (admin can delete any)
    if (courseToDelete && (user?.role === 'admin' || courseToDelete.createdBy === user?.id)) {
      // Since deleteSupabaseCourse now expects no arguments and always returns true,
      // we don't pass any arguments and just check the returned value
      const success = await deleteSupabaseCourse();
      if (!success) {
        toast.error('Չհաջողվեց հեռացնել կուրսը');
      }
    } else {
      toast.error('Դուք չունեք իրավունք ջնջելու այս կուրսը');
    }
  };

  return {
    courses,
    userCourses,
    isLoading,
    selectedCourse,
    setSelectedCourse,
    isAddDialogOpen,
    isEditDialogOpen,
    newCourse,
    newModule,
    setNewCourse,
    setNewModule,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    handleAddCourse,
    handleEditCourse,
    handleEditInit,
    handleAddModule,
    handleRemoveModule,
    handleAddModuleToEdit,
    handleRemoveModuleFromEdit,
    handleDeleteCourse
  };
};
