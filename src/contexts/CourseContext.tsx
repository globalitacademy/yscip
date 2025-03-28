
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Course, CourseContextType } from '@/components/courses/types/index';
import { ProfessionalCourse } from '@/components/courses/types/index';
import { useCourseManagement } from '@/components/courses/useCourseManagement';

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Instead of duplicating state and logic, we'll use the refactored useCourseManagement hook
  const courseManagement = useCourseManagement();
  
  // Map the courseManagement properties to the expected context value
  const contextValue: CourseContextType = {
    // Collection states
    courses: courseManagement.courses,
    userCourses: courseManagement.userCourses,
    professionalCourses: courseManagement.professionalCourses,
    userProfessionalCourses: courseManagement.userProfessionalCourses,
    
    // UI states
    isLoading: courseManagement.loading || false,
    error: null, // This wasn't in the original useCourseManagement
    activeCourse: null, // This wasn't in the original useCourseManagement
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
    setCourses: (courses) => courseManagement.setCourses(courses),
    setProfessionalCourses: (courses) => courseManagement.setProfessionalCourses(courses),
    setIsCreateDialogOpen: courseManagement.setIsAddDialogOpen,
    setIsEditDialogOpen: courseManagement.setIsEditDialogOpen,
    setIsDeleteDialogOpen: courseManagement.setIsDeleteDialogOpen,
    
    // Methods that are mappable directly
    handleAddProfessionalCourse: courseManagement.handleAddProfessionalCourse,
    handleEditProfessionalCourse: courseManagement.handleUpdateProfessionalCourse,
    
    // Data operations - map to closest equivalents
    loadCourses: async () => {
      await courseManagement.loadCoursesFromDatabase();
      return;
    },
    handleSearchChange: () => {}, // Not implemented in the refactored hooks
    handleCategoryChange: () => {}, // Not implemented in the refactored hooks
    handleDifficultyChange: () => {}, // Not implemented in the refactored hooks
    handleSortChange: () => {}, // Not implemented in the refactored hooks
    resetFilters: () => {}, // Not implemented in the refactored hooks
    
    // Dialog handlers - map to closest equivalents
    handleOpenEditDialog: (course: Course) => courseManagement.handleEditInit(course),
    handleCloseEditDialog: () => courseManagement.setIsEditDialogOpen(false),
    handleOpenDeleteDialog: () => courseManagement.setIsDeleteDialogOpen(true),
    handleCloseDeleteDialog: () => courseManagement.setIsDeleteDialogOpen(false),
    handleOpenCreateProfessionalDialog: () => {},
    handleCloseCreateProfessionalDialog: () => {},
    handleOpenEditProfessionalDialog: (course: ProfessionalCourse) => {
      courseManagement.setSelectedProfessionalCourse(course);
      courseManagement.setIsEditDialogOpen(true);
    },
    handleCloseEditProfessionalDialog: () => courseManagement.setIsEditDialogOpen(false),
    handleOpenDeleteProfessionalDialog: () => {},
    handleCloseDeleteProfessionalDialog: () => {},
    
    // CRUD operations
    handleCreateCourse: async (course) => {
      courseManagement.handleAddCourse(course);
      return true;
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
    loading: courseManagement.loading,
    loadCoursesFromDatabase: courseManagement.loadCoursesFromDatabase,
    loadCoursesFromLocalStorage: courseManagement.loadCoursesFromLocalStorage,
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

export const useCourseContext = (): CourseContextType => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourseContext must be used within a CourseProvider');
  }
  return context;
};
