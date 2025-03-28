
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

  // Simplified delete handler that properly handles errors
  const handleDelete = async () => {
    try {
      if (!selectedCourse || !selectedCourse.id) {
        toast.error("Դասընթացը չի գտնվել");
        return false;
      }
      
      console.log("Deleting course with ID:", selectedCourse.id);
      const success = await handleDeleteCourse(selectedCourse.id);
      
      if (success) {
        console.log("Course successfully deleted");
        return true;
      } else {
        console.error("handleDeleteCourse returned false");
        toast.error("Դասընթացը չի ջնջվել: Սերվերը մերժեց հարցումը");
        return false;
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
