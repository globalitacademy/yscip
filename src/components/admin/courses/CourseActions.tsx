
import React, { useState } from 'react';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { useAuth } from '@/contexts/AuthContext';
import { ActionButtons } from './actions/ActionButtons';
import { DeleteConfirmDialog } from './actions/DeleteConfirmDialog';
import { useToggleCourseStatus } from './actions/useToggleCourseStatus';
import { useDeleteCourse } from './actions/useDeleteCourse';

interface CourseActionsProps {
  course: ProfessionalCourse;
  onStatusChange: (updatedCourse: ProfessionalCourse) => void;
  onDelete: (courseId: string) => void;
}

export const CourseActions: React.FC<CourseActionsProps> = ({
  course,
  onStatusChange,
  onDelete,
}) => {
  const [actionType, setActionType] = useState<'delete' | 'status' | null>(null);
  const { user } = useAuth();
  
  // Check if user can modify this course
  const canModify = user && (
    user.role === 'admin' || 
    course.createdBy === user.id || 
    course.createdBy === user.name
  );

  // Use our custom hooks
  const { isLoading: isStatusLoading, toggleCourseStatus } = useToggleCourseStatus({ onStatusChange });
  const { 
    isLoading: isDeleteLoading, 
    isDeleteDialogOpen, 
    setIsDeleteDialogOpen, 
    deleteCourse 
  } = useDeleteCourse({ onDelete });

  // Handler for status toggle
  const handleStatusToggle = async () => {
    setActionType('status');
    await toggleCourseStatus(course, canModify);
    setActionType(null);
  };

  // Handler for delete confirmation
  const handleDeleteCourse = async () => {
    setActionType('delete');
    await deleteCourse(course, canModify);
    setActionType(null);
  };

  return (
    <>
      <ActionButtons 
        courseId={course.id}
        isPublic={course.is_public}
        canModify={canModify}
        onStatusToggle={handleStatusToggle}
        onDeleteClick={() => setIsDeleteDialogOpen(true)}
        isLoadingStatus={isStatusLoading || isDeleteLoading}
        actionType={actionType}
      />

      <DeleteConfirmDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteCourse}
        isLoading={isDeleteLoading && actionType === 'delete'}
        courseTitle={course.title}
      />
    </>
  );
};
