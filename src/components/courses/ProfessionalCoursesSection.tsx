
import React from 'react';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import ProfessionalCourseListItem from './ProfessionalCourseListItem';
import CourseEmptyState from './CourseEmptyState';

interface ProfessionalCoursesSectionProps {
  courses?: ProfessionalCourse[];
  userPermissions?: any;
  currentUserId?: string;
  onEditCourse?: (course: ProfessionalCourse) => void;
  onDeleteCourse?: (id: string) => void;
}

const ProfessionalCoursesSection: React.FC<ProfessionalCoursesSectionProps> = ({
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
      <h3 className="text-xl font-semibold">Մասնագիտական դասընթացներ</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {safeCourses.map((course) => {
          const canEdit = userPermissions?.canEditCourse(course.createdBy);
          const canDelete = userPermissions?.canDeleteCourse(course.createdBy);
          const isOwnCourse = course.createdBy === currentUserId;
          const pendingApproval = isOwnCourse && !course.is_public && userPermissions?.requiresApproval;
          
          return (
            <ProfessionalCourseListItem 
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

export default ProfessionalCoursesSection;
