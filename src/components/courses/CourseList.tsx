
import React from 'react';
import { Course } from './types';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import CourseEmptyState from './CourseEmptyState';
import ProfessionalCoursesSection from './ProfessionalCoursesSection';
import StandardCoursesSection from './StandardCoursesSection';
import { useCourseListActions } from './hooks/useCourseListActions';

interface CourseListProps {
  courses: Course[];
  professionalCourses: ProfessionalCourse[];
  userPermissions?: any;
  currentUserId?: string;
  // Optional functions for when used outside of CourseProvider
  onEditCourse?: (course: Course) => void;
  onDeleteCourse?: (course: Course) => void;
  onEditProfessionalCourse?: (course: ProfessionalCourse) => void;
  onDeleteProfessionalCourse?: (id: string) => void;
}

const CourseList: React.FC<CourseListProps> = ({ 
  courses, 
  professionalCourses,
  userPermissions,
  currentUserId,
  onEditCourse,
  onDeleteCourse,
  onEditProfessionalCourse,
  onDeleteProfessionalCourse
}) => {
  const { 
    handleEditCourse, 
    handleDeleteCourse, 
    handleEditProfessionalCourse, 
    handleDeleteProfessionalCourse 
  } = useCourseListActions();

  if (courses.length === 0 && professionalCourses.length === 0) {
    return <CourseEmptyState />;
  }

  return (
    <div className="space-y-6">
      {/* Professional Courses Section */}
      {professionalCourses.length > 0 && (
        <ProfessionalCoursesSection 
          courses={professionalCourses}
          userPermissions={userPermissions}
          currentUserId={currentUserId}
          onEditCourse={(course) => handleEditProfessionalCourse(course, onEditProfessionalCourse)}
          onDeleteCourse={(id) => handleDeleteProfessionalCourse(id, onDeleteProfessionalCourse)}
        />
      )}

      {/* Standard Courses Section */}
      {courses.length > 0 && (
        <StandardCoursesSection 
          courses={courses}
          userPermissions={userPermissions}
          currentUserId={currentUserId}
          onEditCourse={(course) => handleEditCourse(course, onEditCourse)}
          onDeleteCourse={(course) => handleDeleteCourse(course, onDeleteCourse)}
        />
      )}
    </div>
  );
};

export default CourseList;
