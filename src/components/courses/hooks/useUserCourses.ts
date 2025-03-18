
import { useState, useEffect } from 'react';
import { Course } from '../types';
import { useAuth } from '@/contexts/AuthContext';

export const useUserCourses = () => {
  const { user } = useAuth();
  const [userCourses, setUserCourses] = useState<Course[]>([]);
  
  // This hook will need to be passed the courses from the parent hook
  const filterUserCourses = (courses: Course[]) => {
    if (!user) return [];
    const filteredCourses = courses.filter(course => course.createdBy === user.id);
    setUserCourses(filteredCourses);
    return filteredCourses;
  };

  return {
    userCourses,
    filterUserCourses
  };
};
