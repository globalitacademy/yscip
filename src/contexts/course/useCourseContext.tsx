
import { useContext } from 'react';
import { CourseContext } from './CourseContext';
import { CourseContextType } from '@/components/courses/types';

/**
 * Custom hook to access the CourseContext
 * Throws an error if used outside of a CourseProvider
 */
export const useCourseContext = (): CourseContextType => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourseContext must be used within a CourseProvider');
  }
  return context;
};
