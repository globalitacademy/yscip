
import React from 'react';
import { useCourseContext } from '@/contexts/CourseContext';
import DeleteCourseDialog from './DeleteCourseDialog';
import EditCourseDialog from './EditCourseDialog';

const CourseDialogManager: React.FC = () => {
  const {
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedCourse,
    setSelectedCourse,
    professionalCourse,
    setProfessionalCourse,
    newModule,
    setNewModule,
    handleAddModuleToEdit,
    handleRemoveModuleFromEdit,
    handleUpdateCourse,
    handleDeleteCourse,
    courseType,
    setCourseType
  } = useCourseContext();

  return (
    <>
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
        isProfessionalCourse={courseType === 'professional'}
        professionalCourse={professionalCourse}
        setProfessionalCourse={setProfessionalCourse}
        courseType={courseType}
        setCourseType={setCourseType}
      />

      <DeleteCourseDialog 
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        selectedCourse={selectedCourse}
        onDelete={() => selectedCourse?.id ? 
          handleDeleteCourse(selectedCourse.id) : 
          Promise.resolve(false)}
      />
    </>
  );
};

export default CourseDialogManager;
