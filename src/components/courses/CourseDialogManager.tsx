
import React, { useState } from 'react';
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
    handleDeleteProfessionalCourse,
    courseType,
    setCourseType
  } = useCourseContext();

  const [isDeleting, setIsDeleting] = useState(false);

  // Enhanced delete handler with better error handling
  const handleDelete = async () => {
    if (isDeleting || !selectedCourse || !selectedCourse.id) {
      console.error("Delete attempted with invalid state:", { 
        isDeleting, 
        selectedCourseExists: !!selectedCourse, 
        selectedCourseId: selectedCourse?.id 
      });
      toast.error("Դասընթացը չի գտնվել");
      return false;
    }
    
    try {
      setIsDeleting(true);
      console.log("Starting delete for course:", selectedCourse.id, "of type:", courseType);
      
      // Call the appropriate delete handler based on course type
      const success = courseType === 'professional' 
        ? await handleDeleteProfessionalCourse(selectedCourse.id)
        : await handleDeleteCourse(selectedCourse.id);
      
      console.log("Delete operation result:", success);
      
      if (success) {
        toast.success("Դասընթացը հաջողությամբ ջնջվել է");
        setIsDeleteDialogOpen(false);
        return true;
      } else {
        toast.error("Դասընթացը չի ջնջվել: Գործողությունը ձախողվեց");
        return false;
      }
    } catch (error) {
      console.error("Error in handleDelete:", error);
      toast.error("Ջնջման ժամանակ սխալ է տեղի ունեցել");
      return false;
    } finally {
      setIsDeleting(false);
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
        isDeleting={isDeleting}
      />
    </>
  );
};

export default CourseDialogManager;
