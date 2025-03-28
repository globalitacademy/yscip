
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
    courseType,
    setCourseType
  } = useCourseContext();

  const [isDeleting, setIsDeleting] = useState(false);

  // Enhanced delete handler with better error handling
  const handleDelete = async () => {
    if (isDeleting) return false;
    
    try {
      setIsDeleting(true);
      
      if (!selectedCourse || !selectedCourse.id) {
        console.error("Delete attempted with no valid course selected");
        toast.error("Դասընթացը չի գտնվել");
        return false;
      }
      
      console.log("Starting delete for course:", selectedCourse.id, "of type:", courseType);
      
      // Determine course type and call appropriate handler
      const success = courseType === 'professional' 
        ? await handleDeleteCourse(selectedCourse.id)
        : await handleDeleteCourse(selectedCourse.id);
      
      console.log("Delete operation result:", success);
      
      if (success) {
        toast.success("Դասընթացը հաջողությամբ ջնջվել է");
        setIsDeleteDialogOpen(false);
        return true;
      } else {
        console.error("Course deletion failed - server returned false");
        toast.error("Դասընթացը չի ջնջվել: Սերվերը մերժեց հարցումը");
        return false;
      }
    } catch (error) {
      console.error("Fatal error in handleDelete:", error);
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
