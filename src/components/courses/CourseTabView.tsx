
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from './CourseContext';
import CourseList from './CourseList';
import EditCourseDialog from './EditCourseDialog';
import { Course } from './types';
import { useProjectPermissions } from '@/hooks/useProjectPermissions';

const CourseTabView: React.FC = () => {
  const { user } = useAuth();
  const coursesContext = useCourses();
  const permissions = useProjectPermissions(user?.role);
  
  // Fixed strings for newModule to match expected type
  const [newModule, setNewModule] = useState<string>('');
  
  // Local state for selected course
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Check if user has admin permissions
  const canManageAllCourses = permissions.canViewAllProjects || user?.role === 'admin';
  
  const handleEditInit = (course: Course) => {
    setSelectedCourse(course);
    setIsEditDialogOpen(true);
  };
  
  // Fix the type here to make sure it accepts the Course parameter
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

  // Determine which courses to display based on user role
  const displayCourses = canManageAllCourses 
    ? coursesContext.courses 
    : coursesContext.userCourses;

  return (
    <>
      <CourseList
        courses={displayCourses}
        userCourses={coursesContext.userCourses}
        isAdmin={canManageAllCourses}
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
