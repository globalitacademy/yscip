
import React, { createContext, useContext, ReactNode } from 'react';
import { useCourseManagement } from './useCourseManagement';
import { Course } from './types';
import { ProfessionalCourse } from './types/ProfessionalCourse';

// This file is maintained for backward compatibility
// It delegates to the main CourseContext in the contexts folder
import { CourseProvider as MainCourseProvider, useCourseContext as useMainCourseContext } from '@/contexts/CourseContext';

type CourseContextType = ReturnType<typeof useCourseManagement>;

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const useCourses = (): CourseContextType => {
  // Try to use the local context first
  const context = useContext(CourseContext);
  if (!context) {
    // Fall back to the main context if local context is not available
    return useMainCourseContext() as unknown as CourseContextType;
  }
  return context;
};

interface CourseProviderProps {
  children: ReactNode;
}

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const courseManagement = useCourseManagement();
  
  return (
    <CourseContext.Provider value={courseManagement}>
      {children}
    </CourseContext.Provider>
  );
};
