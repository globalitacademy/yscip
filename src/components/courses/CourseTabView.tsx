
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from './CourseContext';
import CourseList from './CourseList';
import EditCourseDialog from './EditCourseDialog';

const CourseTabView: React.FC = () => {
  const { user } = useAuth();
  const {
    courses,
    professionalCourses,
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
    professionalCourse = {},
    setProfessionalCourse = () => {},
    courseType = 'standard',
    setCourseType = () => {}
  } = useCourses();

  const isAdmin = user?.role === 'admin';

  return (
    <>
      <CourseList
        courses={courses}
        professionalCourses={professionalCourses}
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
        courseType={courseType}
        setCourseType={setCourseType}
        professionalCourse={professionalCourse}
        setProfessionalCourse={setProfessionalCourse}
      />
    </>
  );
};

export default CourseTabView;
