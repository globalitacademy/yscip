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
  return <div className="dark:bg-gray-900">
      {/* Educational Cycle Timeline */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-900/80 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <CycleTimeline />
        </div>
      </section>
      
      {/* Educational Modules */}
      <ModulesInfographic />
      
      {/* Courses Section */}
      
    </div>;
};
export default EducationalCycleInfographic;