
import { useEffect } from 'react';
import { useCourseData } from './hooks/useCourseData';
import { useUserCourses } from './hooks/useUserCourses';
import { useCourseActions } from './hooks/useCourseActions';

export const useSupabaseCourses = () => {
  const { courses, isLoading, refreshCourses } = useCourseData();
  const { userCourses, filterUserCourses } = useUserCourses();
  const { addCourse, updateCourse, deleteCourse, isProcessing } = useCourseActions();

  // Update userCourses whenever courses change
  useEffect(() => {
    filterUserCourses(courses);
  }, [courses]);

  return {
    courses,
    userCourses,
    isLoading,
    isProcessing,
    addCourse,
    updateCourse,
    deleteCourse,
    refreshCourses
  };
};
