
import React from 'react';
import { Course } from './types';
import StandardCourseListItem from './StandardCourseListItem';
import CourseEmptyState from './CourseEmptyState';

interface StandardCoursesSectionProps {
  courses?: Course[];
  userPermissions?: any;
  currentUserId?: string;
  onEditCourse?: (course: Course) => void;
  onDeleteCourse?: (course: Course) => void;
}

const StandardCoursesSection: React.FC<StandardCoursesSectionProps> = ({
  courses = [], // Provide default empty array to prevent undefined errors
  userPermissions,
  currentUserId,
  onEditCourse,
  onDeleteCourse
}) => {
  // Ensure courses is always an array even if undefined or null is passed
  const safeCourses = Array.isArray(courses) ? courses : [];
  
  if (safeCourses.length === 0) return <CourseEmptyState />;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Ստանդարտ դասընթացներ</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {safeCourses.map((course) => {
          const canEdit = userPermissions?.canEditCourse(course.createdBy);
          const canDelete = userPermissions?.canDeleteCourse(course.createdBy);
          const isOwnCourse = course.createdBy === currentUserId;
          const pendingApproval = isOwnCourse && !course.is_public && userPermissions?.requiresApproval;
          
          return (
            <StandardCourseListItem 
              key={course.id}
              course={course}
              canEdit={canEdit}
              canDelete={canDelete}
              isOwnCourse={isOwnCourse}
              pendingApproval={pendingApproval}
              onEdit={onEditCourse}
              onDelete={onDeleteCourse}
            />
          );
        })}
      </div>
    </div>
  );
};

export default StandardCoursesSection;
