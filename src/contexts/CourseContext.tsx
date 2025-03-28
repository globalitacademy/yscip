
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Course, CourseContextType, ProfessionalCourse } from '@/components/courses/types';
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
    courses: courseManager.courses,
    userCourses: courseManager.userCourses,
    professionalCourses: courseManager.professionalCourses,
    userProfessionalCourses: courseManager.userProfessionalCourses,
    isLoading: courseManager.isLoading,
    error: courseManager.error,
    activeCourse: courseManager.activeCourse,
    filteredCourses: courseManager.filteredCourses,
    filteredProfessionalCourses: courseManager.filteredProfessionalCourses,
    searchTerm: courseManager.searchTerm,
    selectedCategory: courseManager.selectedCategory,
    selectedDifficulty: courseManager.selectedDifficulty,
    selectedSort: courseManager.selectedSort,
    isEditDialogOpen: courseManager.isEditDialogOpen,
    isDeleteDialogOpen: courseManager.isDeleteDialogOpen,
    isCreateProfessionalDialogOpen: courseManager.isCreateProfessionalDialogOpen,
    isEditProfessionalDialogOpen: courseManager.isEditProfessionalDialogOpen,
    isDeleteProfessionalDialogOpen: courseManager.isDeleteProfessionalDialogOpen,
    courseToEdit: courseManager.courseToEdit,
    courseToDelete: courseManager.courseToDelete,
    professionalCourseToEdit: courseManager.professionalCourseToEdit,
    professionalCourseToDelete: courseManager.professionalCourseToDelete,
    loadCourses: courseManager.loadCourses,
    handleSearchChange: courseManager.handleSearchChange,
    handleCategoryChange: courseManager.handleCategoryChange,
    handleDifficultyChange: courseManager.handleDifficultyChange,
    handleSortChange: courseManager.handleSortChange,
    resetFilters: courseManager.resetFilters,
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
    handleCreateCourse: courseManager.handleCreateCourse,
    handleUpdateCourse: courseManager.handleUpdateCourse,
    handleDeleteCourse: courseManager.handleDeleteCourse,
    handleCreateProfessionalCourse: courseManager.handleCreateProfessionalCourse,
    handleUpdateProfessionalCourse: courseManager.handleUpdateProfessionalCourse,
    handleDeleteProfessionalCourse: courseManager.handleDeleteProfessionalCourse,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    setCourses,
    setProfessionalCourses
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
