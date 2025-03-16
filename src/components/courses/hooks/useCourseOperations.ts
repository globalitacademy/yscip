
import { useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Course } from '../types';
import { useAuth } from '@/contexts/AuthContext';
import { initializeCourses, saveCourses } from '../utils/storageUtils';

export const useCourseOperations = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>(initializeCourses());
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

  // Get user's courses
  const userCourses = courses.filter(course => course.createdBy === user?.id);

  const handleAddCourse = () => {
    if (!newCourse.name || !newCourse.description || !newCourse.duration) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
      return;
    }

    const courseToAdd: Course = {
      id: uuidv4(),
      name: newCourse.name,
      description: newCourse.description,
      specialization: newCourse.specialization,
      duration: newCourse.duration,
      modules: newCourse.modules || [],
      createdBy: user?.id || 'unknown'
    };

    const updatedCourses = [...courses, courseToAdd];
    setCourses(updatedCourses);
    saveCourses(updatedCourses);
    
    setNewCourse({
      name: '',
      description: '',
      specialization: '',
      duration: '',
      modules: [],
      createdBy: user?.id || ''
    });
    setIsAddDialogOpen(false);
    toast.success('Կուրսը հաջողությամբ ավելացվել է');
  };

  const handleEditCourse = () => {
    if (!selectedCourse) return;
    
    if (!selectedCourse.name || !selectedCourse.description || !selectedCourse.duration) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
      return;
    }

    const updatedCourses = courses.map(course => 
      course.id === selectedCourse.id ? selectedCourse : course
    );
    
    setCourses(updatedCourses);
    saveCourses(updatedCourses);
    setIsEditDialogOpen(false);
    toast.success('Կուրսը հաջողությամբ թարմացվել է');
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

  const handleDeleteCourse = (id: string) => {
    const courseToDelete = courses.find(course => course.id === id);
    
    // Only allow users to delete their own courses (admin can delete any)
    if (courseToDelete && (user?.role === 'admin' || courseToDelete.createdBy === user?.id)) {
      const updatedCourses = courses.filter(course => course.id !== id);
      setCourses(updatedCourses);
      saveCourses(updatedCourses);
      toast.success('Կուրսը հաջողությամբ հեռացվել է');
    } else {
      toast.error('Դուք չունեք իրավունք ջնջելու այս կուրսը');
    }
  };

  return {
    courses,
    userCourses,
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
