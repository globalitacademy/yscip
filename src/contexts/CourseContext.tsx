import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Course } from '@/components/courses/types';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { useCourseManager } from '@/components/courses/hooks/useCourseManager';

// Context type definition
interface CourseContextType {
  // State
  courses: Course[];
  professionalCourses: ProfessionalCourse[];
  selectedCourse: Course | null;
  professionalCourse: Partial<ProfessionalCourse>;
  isEditDialogOpen: boolean;
  isCreateDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  newModule: string;
  courseType: 'standard' | 'professional';
  
  // State setters
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  setProfessionalCourses: React.Dispatch<React.SetStateAction<ProfessionalCourse[]>>;
  setSelectedCourse: React.Dispatch<React.SetStateAction<Course | null>>;
  setProfessionalCourse: React.Dispatch<React.SetStateAction<Partial<ProfessionalCourse>>>;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  setIsCreateDialogOpen: (isOpen: boolean) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  setNewModule: React.Dispatch<React.SetStateAction<string>>;
  setCourseType: (type: 'standard' | 'professional') => void;
  
  // Actions
  loadCourses: () => Promise<void>;
  handleAddModuleToEdit: () => void;
  handleRemoveModuleFromEdit: (index: number) => void;
  handleCreateCourse: () => void;
  handleEditCourse: () => void;
  handleDeleteCourse: (courseId: string) => void;
  handleEditInit: (course: Course | ProfessionalCourse, type: 'standard' | 'professional') => void;
  handleCreateInit: (type: 'standard' | 'professional') => void;
}

// Create context
const CourseContext = createContext<CourseContextType | undefined>(undefined);

// Provider props
interface CourseProviderProps {
  children: ReactNode;
}

// Provider component
export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const courseManager = useCourseManager();
  
  return (
    <CourseContext.Provider value={courseManager}>
      {children}
    </CourseContext.Provider>
  );
};

// Custom hook for using course context
export const useCourseContext = () => {
  const context = useContext(CourseContext);
  
  if (context === undefined) {
    throw new Error('useCourseContext must be used within a CourseProvider');
  }
  
  return context;
};
