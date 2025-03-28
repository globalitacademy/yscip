
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Course, CourseContextType } from '@/components/courses/types/index';
import { ProfessionalCourse } from '@/components/courses/types/index';
import { useCourseManager } from '@/components/courses/hooks/useCourseManager';

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [professionalCourses, setProfessionalCourses] = useState<ProfessionalCourse[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const courseManager = useCourseManager({
    courses,
    setCourses,
    professionalCourses,
    setProfessionalCourses,
    isCreateDialogOpen,
    setIsCreateDialogOpen
  });

  const contextValue: CourseContextType = {
    // Collection states
    courses: courseManager.courses,
    userCourses: courseManager.userCourses,
    professionalCourses: courseManager.professionalCourses,
    userProfessionalCourses: courseManager.userProfessionalCourses,
    
    // UI states
    isLoading: courseManager.isLoading,
    error: courseManager.error,
    activeCourse: courseManager.activeCourse,
    filteredCourses: courseManager.filteredCourses,
    filteredProfessionalCourses: courseManager.filteredProfessionalCourses,
    searchTerm: courseManager.searchTerm,
    selectedCategory: courseManager.selectedCategory,
    selectedDifficulty: courseManager.selectedDifficulty,
    selectedSort: courseManager.selectedSort,
    
    // Dialog states
    isEditDialogOpen: courseManager.isEditDialogOpen,
    isDeleteDialogOpen: courseManager.isDeleteDialogOpen,
    isCreateProfessionalDialogOpen: courseManager.isCreateProfessionalDialogOpen,
    isEditProfessionalDialogOpen: courseManager.isEditProfessionalDialogOpen,
    isDeleteProfessionalDialogOpen: courseManager.isDeleteProfessionalDialogOpen,
    isCreateDialogOpen,
    isAddDialogOpen: false, // Add missing property
    setIsAddDialogOpen: () => {}, // Add missing method
    
    // Edit object states
    courseToEdit: courseManager.courseToEdit,
    courseToDelete: courseManager.courseToDelete,
    professionalCourseToEdit: courseManager.professionalCourseToEdit,
    professionalCourseToDelete: courseManager.professionalCourseToDelete,
    
    // Collection setters
    setCourses,
    setProfessionalCourses,
    setIsCreateDialogOpen,
    setIsEditDialogOpen: courseManager.setIsEditDialogOpen,
    setIsDeleteDialogOpen: courseManager.setIsDeleteDialogOpen,
    
    // Additional missing methods
    handleAddProfessionalCourse: courseManager.handleCreateProfessionalCourse,
    handleEditProfessionalCourse: courseManager.handleUpdateProfessionalCourse,
    
    // Data operations
    loadCourses: courseManager.loadCourses,
    handleSearchChange: courseManager.handleSearchChange,
    handleCategoryChange: courseManager.handleCategoryChange,
    handleDifficultyChange: courseManager.handleDifficultyChange,
    handleSortChange: courseManager.handleSortChange,
    resetFilters: courseManager.resetFilters,
    
    // Dialog handlers
    handleOpenEditDialog: courseManager.handleOpenEditDialog,
    handleCloseEditDialog: courseManager.handleCloseEditDialog,
    handleOpenDeleteDialog: courseManager.handleOpenDeleteDialog,
    handleCloseDeleteDialog: courseManager.handleCloseDeleteDialog,
    handleOpenCreateProfessionalDialog: courseManager.handleOpenCreateProfessionalDialog,
    handleCloseCreateProfessionalDialog: courseManager.handleCloseCreateProfessionalDialog,
    handleOpenEditProfessionalDialog: courseManager.handleOpenEditProfessionalDialog,
    handleCloseEditProfessionalDialog: courseManager.handleCloseEditProfessionalDialog,
    handleOpenDeleteProfessionalDialog: courseManager.handleOpenDeleteProfessionalDialog,
    handleCloseDeleteProfessionalDialog: courseManager.handleCloseDeleteProfessionalDialog,
    
    // CRUD operations
    handleCreateCourse: courseManager.handleCreateCourse,
    handleUpdateCourse: courseManager.handleUpdateCourse,
    handleDeleteCourse: courseManager.handleDeleteCourse,
    handleCreateProfessionalCourse: courseManager.handleCreateProfessionalCourse,
    handleUpdateProfessionalCourse: courseManager.handleUpdateProfessionalCourse,
    handleDeleteProfessionalCourse: courseManager.handleDeleteProfessionalCourse,
    
    // Current editing states
    selectedCourse: courseManager.selectedCourse,
    setSelectedCourse: courseManager.setSelectedCourse,
    professionalCourse: courseManager.professionalCourse,
    setProfessionalCourse: courseManager.setProfessionalCourse,
    courseType: courseManager.courseType,
    setCourseType: courseManager.setCourseType,
    newModule: courseManager.newModule,
    setNewModule: courseManager.setNewModule,
    
    // Additional state management
    handleAddModuleToEdit: courseManager.handleAddModuleToEdit,
    handleRemoveModuleFromEdit: courseManager.handleRemoveModuleFromEdit,
    handleEditCourse: courseManager.handleUpdateCourse,
    handleEditInit: courseManager.handleEditInit,
    handleCreateInit: courseManager.handleCreateInit,
    
    // Add missing properties
    loading: courseManager.isLoading,
    loadCoursesFromDatabase: async () => {}, 
    loadCoursesFromLocalStorage: async () => {},
    syncCoursesWithDatabase: async () => {},
    newProfessionalCourse: courseManager.professionalCourse || {},
    setNewProfessionalCourse: courseManager.setProfessionalCourse
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
