
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Course } from '../types';
import { useAuth } from '@/contexts/AuthContext';
import { useProfessionalCourseManagement } from './useProfessionalCourseManagement';

export const useCourseManagement = () => {
  // Regular course state and handlers
  const [courses, setCourses] = useState<Course[]>([]);
  const [userCourses, setUserCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newModule, setNewModule] = useState('');

  const [newCourse, setNewCourse] = useState<Course>({
    id: '',
    name: '',
    description: '',
    modules: [],
    createdBy: '',
    duration: '',
  });

  const { user } = useAuth();
  
  // Import and use the professional course management hook
  const professionalCourseManagement = useProfessionalCourseManagement();

  const handleAddCourse = useCallback(() => {
    if (!user) return;

    const newId = uuidv4();
    const courseToAdd: Course = {
      ...newCourse,
      id: newId,
      createdBy: user.id,
    };

    setCourses([...courses, courseToAdd]);
    setUserCourses([...userCourses, courseToAdd]);
    setNewCourse({
      id: '',
      name: '',
      description: '',
      modules: [],
      createdBy: '',
      duration: '',
    });
  }, [courses, newCourse, user, userCourses]);

  const handleEditInit = useCallback((course: Course) => {
    setSelectedCourse(course);
    setIsEditDialogOpen(true);
  }, []);

  const handleAddModuleToEdit = useCallback(() => {
    if (!selectedCourse || !newModule) return;

    const updatedModules = [...selectedCourse.modules, newModule];
    setSelectedCourse({ ...selectedCourse, modules: updatedModules });
    setNewModule('');
  }, [newModule, selectedCourse]);

  const handleRemoveModuleFromEdit = useCallback((index: number) => {
    if (!selectedCourse) return;

    const updatedModules = [...selectedCourse.modules];
    updatedModules.splice(index, 1);
    setSelectedCourse({ ...selectedCourse, modules: updatedModules });
  }, [selectedCourse]);

  const handleEditCourse = useCallback(() => {
    if (!selectedCourse) return;

    const updatedCourses = courses.map((course) =>
      course.id === selectedCourse.id ? selectedCourse : course
    );
    setCourses(updatedCourses);

    const updatedUserCourses = userCourses.map((course) =>
      course.id === selectedCourse.id ? selectedCourse : course
    );
    setUserCourses(updatedUserCourses);

    setIsEditDialogOpen(false);
  }, [courses, selectedCourse, userCourses]);

  const handleDeleteCourse = useCallback((id: string) => {
    const updatedCourses = courses.filter((course) => course.id !== id);
    setCourses(updatedCourses);

    const updatedUserCourses = userCourses.filter((course) => course.id !== id);
    setUserCourses(updatedUserCourses);
  }, [courses, userCourses]);

  return {
    // Original course state and handlers
    courses,
    setCourses,
    userCourses,
    selectedCourse,
    setSelectedCourse,
    isEditDialogOpen,
    setIsEditDialogOpen,
    newModule,
    setNewModule,
    handleEditCourse,
    handleEditInit,
    handleAddModuleToEdit,
    handleRemoveModuleFromEdit,
    handleDeleteCourse,

    // Include all professional course state and handlers
    ...professionalCourseManagement
  };
};
