
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCourseContext } from '@/contexts/CourseContext';
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
    handleUpdateCourse,
    handleEditInit,
    handleAddModuleToEdit,
    handleRemoveModuleFromEdit,
    handleDeleteCourse,
    handleOpenDeleteDialog,
    professionalCourse = {},
    setProfessionalCourse = () => {},
    courseType = 'standard',
    setCourseType = () => {}
  } = useCourseContext();

  const isAdmin = user?.role === 'admin';

  // Filter out template courses - only show courses with is_public=true or created by current user
  const filteredCourses = courses.filter(course => 
    course.is_public || course.createdBy === user?.id
  );
  
  const filteredProfessionalCourses = professionalCourses.filter(course => 
    course.is_public || course.createdBy === user?.name
  );

  return (
    <>
      <CourseList
        courses={filteredCourses}
        professionalCourses={filteredProfessionalCourses}
        onEditCourse={handleEditInit}
        onDeleteCourse={handleOpenDeleteDialog}
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
        handleEditCourse={handleUpdateCourse}
        courseType={courseType}
        setCourseType={setCourseType}
        professionalCourse={professionalCourse}
        setProfessionalCourse={setProfessionalCourse}
      />
    </>
  );
};

export default CourseTabView;
