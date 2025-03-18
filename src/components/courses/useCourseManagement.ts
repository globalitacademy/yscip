
import { useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
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
    name: '',
    description: '',
    specialization: '',
    duration: '',
    modules: [],
    createdBy: user?.id || ''
  });
  const [newModule, setNewModule] = useState('');

  const handleAddCourse = async () => {
    if (!newCourse.name || !newCourse.description || !newCourse.duration) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
      return;
    }

    const courseToAdd = {
      name: newCourse.name,
      description: newCourse.description,
      specialization: newCourse.specialization,
      duration: newCourse.duration,
      modules: newCourse.modules || []
    };

    const success = await addSupabaseCourse(courseToAdd);
    
    if (success) {
      setNewCourse({
        name: '',
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
    
    if (!selectedCourse.name || !selectedCourse.description || !selectedCourse.duration) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
      return;
    }

    const success = await updateSupabaseCourse(selectedCourse.id, selectedCourse);
    
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
      modules: [...selectedCourse.modules, newModule]
    });
    setNewModule('');
  };

  const handleRemoveModuleFromEdit = (index: number) => {
    if (!selectedCourse) return;
    const updatedModules = [...selectedCourse.modules];
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
      const success = await deleteSupabaseCourse(id);
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
