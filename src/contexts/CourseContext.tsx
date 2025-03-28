
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
    courses: courseManager.courses,
    userCourses: courseManager.userCourses,
    professionalCourses: courseManager.professionalCourses,
    userProfessionalCourses: courseManager.userProfessionalCourses,
    isLoading: courseManager.loading,
    error: null,
    activeCourse: null,
    filteredCourses: courseManager.courses,
    filteredProfessionalCourses: courseManager.professionalCourses,
    searchTerm: '',
    selectedCategory: null,
    selectedDifficulty: null,
    selectedSort: null,
    isEditDialogOpen: courseManager.isEditDialogOpen,
    isDeleteDialogOpen: courseManager.isDeleteDialogOpen,
    isCreateProfessionalDialogOpen: false,
    isEditProfessionalDialogOpen: false,
    isDeleteProfessionalDialogOpen: false,
    courseToEdit: courseManager.courseToEdit,
    courseToDelete: null,
    professionalCourseToEdit: courseManager.selectedProfessionalCourse,
    professionalCourseToDelete: null,
    loadCourses: courseManager.loadCoursesFromDatabase,
    handleSearchChange: () => {},
    handleCategoryChange: () => {},
    handleDifficultyChange: () => {},
    handleSortChange: () => {},
    resetFilters: () => {},
    handleOpenEditDialog: courseManager.handleEditInit,
    handleCloseEditDialog: () => courseManager.setIsEditDialogOpen(false),
    handleOpenDeleteDialog: () => {},
    handleCloseDeleteDialog: () => courseManager.setIsDeleteDialogOpen(false),
    handleOpenCreateProfessionalDialog: () => {},
    handleCloseCreateProfessionalDialog: () => {},
    handleOpenEditProfessionalDialog: courseManager.handleEditProfessionalCourseInit,
    handleCloseEditProfessionalDialog: () => {},
    handleOpenDeleteProfessionalDialog: () => {},
    handleCloseDeleteProfessionalDialog: () => {},
    handleCreateCourse: courseManager.handleAddCourse,
    handleUpdateCourse: async () => false,
    handleDeleteCourse: courseManager.handleDeleteCourse,
    handleCreateProfessionalCourse: courseManager.handleAddProfessionalCourse,
    handleUpdateProfessionalCourse: async () => false,
    handleDeleteProfessionalCourse: courseManager.handleDeleteProfessionalCourse,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    setCourses,
    setProfessionalCourses,
    selectedCourse: courseManager.selectedCourse,
    setSelectedCourse: courseManager.setSelectedCourse,
    professionalCourse: courseManager.professionalCourse,
    setProfessionalCourse: courseManager.setProfessionalCourse,
    courseType: courseManager.courseType,
    setCourseType: courseManager.setCourseType,
    newModule: courseManager.newModule,
    setNewModule: courseManager.setNewModule,
    handleAddModuleToEdit: courseManager.handleAddModuleToEdit,
    handleRemoveModuleFromEdit: courseManager.handleRemoveModuleFromEdit,
    handleEditCourse: courseManager.handleEditCourse,
    handleEditInit: courseManager.handleEditInit,
    handleCreateInit: courseManager.handleCreateInit,
    setIsEditDialogOpen: courseManager.setIsEditDialogOpen,
    setIsDeleteDialogOpen: courseManager.setIsDeleteDialogOpen
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
