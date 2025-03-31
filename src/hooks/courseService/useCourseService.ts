
import { useState } from 'react';
import { useCourseFetching } from './useCourseFetching';
import { useCourseCreation } from './useCourseCreation';
import { useCourseUpdating } from './useCourseUpdating';
import { useCourseDeletion } from './useCourseDeletion';

/**
 * Hook for handling all course-related database operations
 */
export const useCourseService = () => {
  const [loading, setLoading] = useState(false);
  
  const { fetchCourses } = useCourseFetching(setLoading);
  const { createCourse } = useCourseCreation(setLoading);
  const { updateCourse } = useCourseUpdating(setLoading);
  const { deleteCourse } = useCourseDeletion(setLoading);

  return {
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    loading
  };
};
