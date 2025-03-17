
import React, { createContext, useContext, ReactNode } from 'react';
import { useCourseManagement } from './hooks/useCourseManagement';
import { Course } from './types';
import { ProfessionalCourse } from './types/ProfessionalCourse';

type CourseContextType = ReturnType<typeof useCourseManagement>;

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const useCourses = (): CourseContextType => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourses must be used within a CourseProvider');
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
