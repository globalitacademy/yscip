
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import CourseManagement from '@/components/courses/CourseManagement';
import AddCourseDialog from '@/components/courses/AddCourseDialog';
import { useCourseManagement } from '@/components/courses/useCourseManagement';

const CoursesPage: React.FC = () => {
  const {
    isAddDialogOpen,
    setIsAddDialogOpen,
    newCourse,
    setNewCourse,
    newModule,
    setNewModule,
    handleAddCourse,
    handleAddModule,
    handleRemoveModule
  } = useCourseManagement();

  return (
    <AdminLayout pageTitle="Կուրսեր">
      <CourseManagement />
      
      <AddCourseDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        newCourse={newCourse}
        setNewCourse={setNewCourse}
        handleAddCourse={handleAddCourse}
        newModule={newModule}
        setNewModule={setNewModule}
        handleAddModule={handleAddModule}
        handleRemoveModule={handleRemoveModule}
      />
    </AdminLayout>
  );
};

export default CoursesPage;
