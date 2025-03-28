
import React from 'react';
import { useCourseContext } from '@/contexts/CourseContext';
import DeleteCourseDialog from './DeleteCourseDialog';
import EditCourseDialog from './EditCourseDialog';
import { toast } from 'sonner';

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

  // Function to handle delete based on course type
  const handleDelete = async () => {
    try {
      if (!selectedCourse || !selectedCourse.id) {
        toast.error("Դասընթացը չի գտնվել");
        return false;
      }
      
      console.log("Deleting course:", selectedCourse.id, "Type:", courseType);
      
      // Check if we're dealing with a standard or professional course
      if (courseType === 'professional') {
        // It's a professional course
        return await handleDeleteCourse(selectedCourse.id);
      } else {
        // It's a standard course
        return await handleDeleteCourse(selectedCourse.id);
      }
    } catch (error) {
      console.error("Error in handleDelete:", error);
      toast.error("Ջնջման ժամանակ սխալ է տեղի ունեցել");
      return false;
    }
  };

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
        onDelete={handleDelete}
      />
    </>
  );
};

export default CourseDialogManager;
