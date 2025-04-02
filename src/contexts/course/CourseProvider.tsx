
import React, { useState, useEffect } from 'react';
import { CourseContext } from './CourseContext';
import { useCourseManagement } from '@/components/courses/useCourseManagement';
import { useCourseService } from '@/hooks/courseService';
import { toast } from 'sonner';
import { Course, ProfessionalCourse, CourseContextType } from '@/components/courses/types';

/**
 * Provider component for the CourseContext
 * Handles the state management and connects to course management hooks
 */
export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use the refactored useCourseManagement hook
  const courseManagement = useCourseManagement();
  
  // Use the course service for direct database operations 
  const { fetchAllCourses, loading: serviceLoading } = useCourseService();
  
  // Add a state for error handling
  const [error, setError] = useState<string | null>(null);
  
  // Add effect to load courses on mount
  useEffect(() => {
    const loadInitialCourses = async () => {
      try {
        // Try to load courses from the database first
        await courseManagement.loadCoursesFromDatabase();
      } catch (err: any) {
        console.error("Error loading courses:", err);
        setError("Դասընթացների բեռնման ժամանակ սխալ է տեղի ունեցել");
        
        // Try to load from localStorage as fallback
        const success = await courseManagement.loadCoursesFromLocalStorage();
        if (!success) {
          toast.error("Դասընթացների բեռնման ժամանակ սխալ է տեղի ունեցել");
        }
      }
    };
    
    loadInitialCourses();
  }, []);

  // Map the courseManagement properties to the expected context value
  const contextValue: CourseContextType = {
    // Collection states
    courses: courseManagement.courses,
    userCourses: courseManagement.userCourses,
    professionalCourses: courseManagement.professionalCourses,
    userProfessionalCourses: courseManagement.userProfessionalCourses,
    
    // UI states
    isLoading: courseManagement.loading || serviceLoading,
    error: error,
    activeCourse: null,
    filteredCourses: courseManagement.courses,
    filteredProfessionalCourses: courseManagement.professionalCourses,
    searchTerm: '',
    selectedCategory: '',
    selectedDifficulty: '',
    selectedSort: '',
    
    // Dialog states
    isEditDialogOpen: courseManagement.isEditDialogOpen,
    isDeleteDialogOpen: courseManagement.isDeleteDialogOpen,
    isCreateProfessionalDialogOpen: false,
    isEditProfessionalDialogOpen: false,
    isDeleteProfessionalDialogOpen: false,
    isCreateDialogOpen: courseManagement.isAddDialogOpen,
    isAddDialogOpen: courseManagement.isAddDialogOpen,
    setIsAddDialogOpen: courseManagement.setIsAddDialogOpen,
    
    // Edit object states
    courseToEdit: courseManagement.selectedCourse,
    courseToDelete: null,
    professionalCourseToEdit: courseManagement.selectedProfessionalCourse,
    professionalCourseToDelete: null,
    
    // Collection setters
    setCourses: (courses) => {
      console.log("Setting courses:", courses);
    },
    setProfessionalCourses: (courses) => {
      console.log("Setting professional courses:", courses);
    },
    setIsCreateDialogOpen: courseManagement.setIsAddDialogOpen,
    setIsEditDialogOpen: courseManagement.setIsEditDialogOpen,
    setIsDeleteDialogOpen: courseManagement.setIsDeleteDialogOpen,
    
    // Methods that are mappable directly
    handleAddProfessionalCourse: courseManagement.handleAddProfessionalCourse,
    handleEditProfessionalCourse: courseManagement.handleUpdateProfessionalCourse,
    
    // Data operations
    loadCourses: async () => {
      try {
        setError(null);
        await courseManagement.loadCoursesFromDatabase();
      } catch (error: any) {
        console.error('Error loading courses:', error);
        setError(error.message || "Դասընթացների բեռնման ժամանակ սխալ է տեղի ունեցել");
        toast.error("Դասընթացների բեռնման ժամանակ սխալ է տեղի ունեցել");
      }
    },
    handleSearchChange: (term) => {
      console.log("Search term:", term);
      // Implement filtering logic
    },
    handleCategoryChange: (category) => {
      console.log("Selected category:", category);
      // Implement filtering logic
    },
    handleDifficultyChange: (difficulty) => {
      console.log("Selected difficulty:", difficulty);
      // Implement filtering logic
    },
    handleSortChange: (sortOption) => {
      console.log("Sort option:", sortOption);
      // Implement sorting logic
    },
    resetFilters: () => {
      console.log("Resetting filters");
      // Implement reset logic
    },
    
    // Dialog handlers
    handleOpenEditDialog: (course: Course) => courseManagement.handleEditInit(course),
    handleCloseEditDialog: () => courseManagement.setIsEditDialogOpen(false),
    handleOpenDeleteDialog: () => courseManagement.setIsDeleteDialogOpen(true),
    handleCloseDeleteDialog: () => courseManagement.setIsDeleteDialogOpen(false),
    handleOpenCreateProfessionalDialog: () => {
      courseManagement.setCourseType && courseManagement.setCourseType('professional');
      courseManagement.setIsAddDialogOpen(true);
    },
    handleCloseCreateProfessionalDialog: () => courseManagement.setIsAddDialogOpen(false),
    handleOpenEditProfessionalDialog: (course: ProfessionalCourse) => {
      courseManagement.setSelectedProfessionalCourse(course);
      courseManagement.setIsEditDialogOpen(true);
    },
    handleCloseEditProfessionalDialog: () => courseManagement.setIsEditDialogOpen(false),
    handleOpenDeleteProfessionalDialog: () => courseManagement.setIsDeleteDialogOpen(true),
    handleCloseDeleteProfessionalDialog: () => courseManagement.setIsDeleteDialogOpen(false),
    
    // CRUD operations
    handleCreateCourse: async (course) => {
      const result = await courseManagement.handleAddCourse(course);
      return result !== undefined;
    },
    handleUpdateCourse: async (id, courseData) => {
      return courseManagement.handleUpdateCourse(id, courseData);
    },
    handleDeleteCourse: courseManagement.handleDeleteCourse,
    handleCreateProfessionalCourse: courseManagement.handleAddProfessionalCourse,
    handleUpdateProfessionalCourse: courseManagement.handleUpdateProfessionalCourse,
    handleDeleteProfessionalCourse: courseManagement.handleDeleteProfessionalCourse,
    
    // Current editing states
    selectedCourse: courseManagement.selectedCourse,
    setSelectedCourse: courseManagement.setSelectedCourse,
    professionalCourse: courseManagement.professionalCourse || {},
    setProfessionalCourse: courseManagement.setProfessionalCourse || (() => {}),
    courseType: courseManagement.courseType || 'standard',
    setCourseType: courseManagement.setCourseType || (() => {}),
    newModule: courseManagement.newModule,
    setNewModule: courseManagement.setNewModule,
    
    // Additional state management
    handleAddModuleToEdit: courseManagement.handleAddModuleToEdit,
    handleRemoveModuleFromEdit: courseManagement.handleRemoveModuleFromEdit,
    handleEditCourse: async (id: string, courseData: Partial<Course>) => {
      return courseManagement.handleUpdateCourse(id, courseData);
    },
    handleEditInit: courseManagement.handleEditInit,
    handleCreateInit: (type: 'standard' | 'professional') => {
      courseManagement.setCourseType && courseManagement.setCourseType(type);
      courseManagement.setIsAddDialogOpen(true);
    },
    
    // Additional properties
    loading: courseManagement.loading || serviceLoading,
    loadCoursesFromDatabase: async () => {
      try {
        setError(null);
        return await courseManagement.loadCoursesFromDatabase();
      } catch (err: any) {
        console.error("Error in loadCoursesFromDatabase:", err);
        setError(err.message || "Դասընթացների բեռնման ժամանակ սխալ է տեղի ունեցել");
        return false;
      }
    },
    loadCoursesFromLocalStorage: async () => {
      try {
        const result = await courseManagement.loadCoursesFromLocalStorage();
        return result;
      } catch (err) {
        console.error("Error in loadCoursesFromLocalStorage:", err);
        return false;
      }
    },
    syncCoursesWithDatabase: courseManagement.syncCoursesWithDatabase,
    newProfessionalCourse: courseManagement.newProfessionalCourse,
    setNewProfessionalCourse: courseManagement.setNewProfessionalCourse
  };

  return (
    <CourseContext.Provider value={contextValue}>
      {children}
    </CourseContext.Provider>
  );
};
