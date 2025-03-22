
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from './CourseContext';
import CourseList from './CourseList';
import EditCourseDialog from './EditCourseDialog';
import { Course } from './types';

const CourseTabView: React.FC = () => {
  const { user } = useAuth();
  const coursesContext = useCourses();
  
  // Fixed strings for newModule to match expected type
  const [newModule, setNewModule] = useState<string>('');
  
  // Local state for selected course
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const isAdmin = user?.role === 'admin';
  
  const handleEditInit = (course: Course) => {
    setSelectedCourse(course);
    setIsEditDialogOpen(true);
  };
  
  const handleEditCourse = (editedCourse: Course) => {
    coursesContext.handleEditCourse(editedCourse);
    setIsEditDialogOpen(false);
  };
  
  const handleAddModuleToEdit = () => {
    if (!selectedCourse || !newModule) return;
    
    setSelectedCourse({
      ...selectedCourse,
      modules: [...(selectedCourse.modules || []), newModule]
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

  return (
    <>
      <CourseList
        courses={coursesContext.courses}
        userCourses={coursesContext.userCourses}
        isAdmin={isAdmin}
        onEdit={handleEditInit}
        onDelete={coursesContext.handleDeleteCourse}
      />

      <EditCourseDialog
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        selectedCourse={selectedCourse}
        setSelectedCourse={setSelectedCourse}
        newModule={newModule}
        setNewModule={setNewModule}
        handleAddModuleToEdit={handleAddModuleToEdit}
        handleRemoveModuleFromEdit={handleRemoveModuleFromEdit}
        handleEditCourse={handleEditCourse}
      />
    </>
  );
};

export default CourseTabView;
