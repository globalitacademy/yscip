
import React, { useEffect, useState } from 'react';
import { Course } from '@/components/courses/types';
import ModulesInfographic from './ModulesInfographic';
import CycleTimeline from './CycleTimeline';
import CourseSection from './CourseSection';

const EducationalCycleInfographic: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  
  useEffect(() => {
    // Load courses from localStorage
    const storedCourses = localStorage.getItem('courses');
    if (storedCourses) {
      try {
        const parsedCourses = JSON.parse(storedCourses);
        setCourses(parsedCourses);
      } catch (e) {
        console.error('Error parsing stored courses:', e);
      }
    }
  }, []);

  return (
    <section className="py-8 md:py-16 bg-white dark:bg-gray-900/50 transition-colors duration-300">
      <div className="container mx-auto px-4 space-y-12 md:space-y-16">
        {/* Educational Cycle Timeline */}
        <CycleTimeline />
        
        {/* Educational Modules */}
        <ModulesInfographic />
        
        {/* Courses Section */}
        <CourseSection courses={courses} />
      </div>
    </section>
  );
};

export default EducationalCycleInfographic;
