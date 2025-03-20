
import React from 'react';
import { Course } from '@/components/courses/types';
import CourseMainContent from './CourseMainContent';
import CourseSidebar from './CourseSidebar';

interface CourseDetailContentProps {
  course: Course;
}

const CourseDetailContent: React.FC<CourseDetailContentProps> = ({ course }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
        <p className="text-lg text-muted-foreground mb-6">{course.subtitle}</p>

        <CourseMainContent course={course} />
      </div>

      <div className="lg:col-span-1">
        <CourseSidebar course={course} />
      </div>
    </div>
  );
};

export default CourseDetailContent;
