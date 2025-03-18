
import { Course } from './types';
import { useSupabaseCourses } from './useSupabaseCourses';
import { useCourseState } from './hooks/useCourseState';
import { useModuleManagement } from './hooks/useModuleManagement';
import { useCourseOperations, mockSpecializations } from './hooks/useCourseOperations';

export { mockSpecializations };

export const useCourseManagement = () => {
  // Get course data and loading state from Supabase
  const { 
    courses, 
    userCourses, 
    isLoading
  } = useSupabaseCourses();
  
  // Get course state from custom hook
  const {
    selectedCourse,
    setSelectedCourse,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    newCourse,
    setNewCourse,
    newModule,
    setNewModule
  } = useCourseState();

  // Get module management functions from custom hook
  const {
    handleAddModule: baseHandleAddModule,
    handleRemoveModule,
    handleAddModuleToEdit: baseHandleAddModuleToEdit,
    handleRemoveModuleFromEdit
  } = useModuleManagement(
    newCourse,
    setNewCourse,
    selectedCourse,
    setSelectedCourse
  );

  // Wrapper functions that use the current newModule state
  const handleAddModule = () => {
    baseHandleAddModule(newModule);
    setNewModule('');
  };

  const handleAddModuleToEdit = () => {
    baseHandleAddModuleToEdit(newModule);
    setNewModule('');
  };

  // Get course CRUD operations from custom hook
  const {
    handleAddCourse,
    handleEditCourse,
    handleDeleteCourse
  } = useCourseOperations(
    courses,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    newCourse,
    setNewCourse,
    selectedCourse
  );

  // Function to initialize edit mode for a course
  const handleEditInit = (course: Course) => {
    setSelectedCourse({...course});
    setIsEditDialogOpen(true);
  };

  return {
    courses,
    userCourses,
    isLoading,
    selectedCourse,
    setSelectedCourse,
    isAddDialogOpen,
    isEditDialogOpen,
    newCourse,
    newModule,
    setNewCourse,
    setNewModule,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    handleAddCourse,
    handleEditCourse,
    handleEditInit,
    handleAddModule,
    handleRemoveModule,
    handleAddModuleToEdit,
    handleRemoveModuleFromEdit,
    handleDeleteCourse
  };
};
