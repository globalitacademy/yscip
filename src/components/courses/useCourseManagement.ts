import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useInitialCourseStates, mockSpecializations } from './hooks/useCourseInit';
import { useCourseDataLoading } from './hooks/useCourseDataLoading';
import { useCourseOperations } from './hooks/useCourseOperations';
import { useCourseModuleManagement } from './hooks/useCourseModuleManagement';
import { useCourseEditing } from './hooks/useCourseEditing';

// Re-export mockSpecializations to maintain compatibility
export { mockSpecializations };

export const useCourseManagement = () => {
  const { user } = useAuth();
  
  // Initialize all states
  const {
    courses,
    setCourses,
    professionalCourses,
    setProfessionalCourses,
    loading,
    setLoading,
    selectedCourse,
    setSelectedCourse,
    selectedProfessionalCourse,
    setSelectedProfessionalCourse,
    professionalCourse,
    setProfessionalCourse,
    courseType,
    setCourseType,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    newCourse,
    setNewCourse,
    newProfessionalCourse,
    setNewProfessionalCourse,
    newModule,
    setNewModule
  } = useInitialCourseStates();

  // Initialize data loading functions
  const {
    loadCoursesFromDatabase,
    syncCoursesWithDatabase,
    loadCoursesFromLocalStorage
  } = useCourseDataLoading(setProfessionalCourses, setLoading);

  // Initialize CRUD operations
  const {
    handleAddCourse,
    handleAddProfessionalCourse,
    handleUpdateCourse,
    handleUpdateProfessionalCourse,
    handleDeleteCourse,
    handleDeleteProfessionalCourse
  } = useCourseOperations(
    courses,
    setCourses,
    professionalCourses,
    setProfessionalCourses,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setNewProfessionalCourse,
    newProfessionalCourse
  );

  // Initialize module management
  const {
    handleAddModule,
    handleRemoveModule,
    handleAddModuleToEdit,
    handleRemoveModuleFromEdit
  } = useCourseModuleManagement(
    selectedCourse,
    setSelectedCourse,
    newCourse,
    setNewCourse,
    newModule,
    setNewModule
  );

  // Initialize editing functions
  const {
    handleEditCourse,
    handleEditInit,
    handleEditProfessionalCourseInit
  } = useCourseEditing(
    courses,
    setCourses,
    selectedCourse,
    setSelectedCourse,
    setIsEditDialogOpen,
    setSelectedProfessionalCourse
  );

  // Initialize data loading on component mount
  useEffect(() => {
    const loadInitialCourses = async () => {
      setLoading(true);
      try {
        // We'll keep calling this method for backward compatibility,
        // but it's now essentially a no-op
        await loadCoursesFromLocalStorage();
        
        // This is the method that actually loads data from the database
        await loadCoursesFromDatabase();
      } catch (error) {
        console.error('Error loading initial courses:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialCourses();
  }, [loadCoursesFromLocalStorage, loadCoursesFromDatabase, setLoading]);

  // Compute derived states
  const userCourses = courses.filter(course => course.createdBy === user?.id);
  const userProfessionalCourses = professionalCourses.filter(course => course.createdBy === user?.name);

  return {
    // Collection states
    courses,
    userCourses,
    professionalCourses,
    userProfessionalCourses,
    
    // Selection states
    selectedCourse,
    selectedProfessionalCourse,
    setSelectedCourse,
    setSelectedProfessionalCourse,
    
    // Dialog states
    isAddDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    
    // Form states
    newCourse,
    newProfessionalCourse,
    newModule,
    
    // Loading state
    loading,
    
    // State setters
    setNewCourse,
    setNewProfessionalCourse,
    setNewModule,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    
    // CRUD operations
    handleAddCourse,
    handleAddProfessionalCourse,
    handleUpdateCourse,
    handleUpdateProfessionalCourse,
    handleEditCourse,
    handleEditInit,
    handleEditProfessionalCourseInit,
    handleAddModule,
    handleRemoveModule,
    handleAddModuleToEdit,
    handleRemoveModuleFromEdit,
    handleDeleteCourse,
    handleDeleteProfessionalCourse,
    
    // Data fetching
    loadCoursesFromDatabase,
    syncCoursesWithDatabase,
    loadCoursesFromLocalStorage,
    
    // Additional state for form management
    professionalCourse,
    setProfessionalCourse,
    courseType,
    setCourseType
  };
};
