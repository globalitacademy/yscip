
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCourseDetails } from '@/hooks/courseService/useCourseDetails';
import { useCourseStatusToggle } from '@/hooks/courseService/useCourseStatusToggle';
import { useCourseDelete } from '@/hooks/courseService/useCourseDelete';
import { useCourseEdit } from '@/hooks/courseService/useCourseEdit';
import CourseWrapper from './course-detail/CourseWrapper';

interface CourseDetailPageProps {
  id?: string;
  isEditMode?: boolean;
}

export const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ id, isEditMode = false }) => {
  const { user } = useAuth();
  
  // Use our custom hooks to handle different aspects of the course detail page
  const { course, setCourse, loading, editedCourse, setEditedCourse } = useCourseDetails(id);
  const { actionType, handlePublishToggle } = useCourseStatusToggle(course, setCourse);
  const { isDeleteDialogOpen, setIsDeleteDialogOpen, handleDeleteCourse } = useCourseDelete(id);
  const { isEditDialogOpen, setIsEditDialogOpen, handleSaveChanges } = 
    useCourseEdit(course, editedCourse, setEditedCourse, setCourse, isEditMode);

  // Automatically open edit dialog if in edit mode
  React.useEffect(() => {
    if (isEditMode && course && !isEditDialogOpen) {
      setIsEditDialogOpen(true);
    }
  }, [isEditMode, course, isEditDialogOpen, setIsEditDialogOpen]);

  // Determine if user can edit the course
  const canEdit = user && (user.role === 'admin' || course?.createdBy === user.name);

  return (
    <CourseWrapper
      course={course}
      loading={loading}
      isEditDialogOpen={isEditDialogOpen}
      setIsEditDialogOpen={setIsEditDialogOpen}
      isDeleteDialogOpen={isDeleteDialogOpen}
      setIsDeleteDialogOpen={setIsDeleteDialogOpen}
      handleSaveChanges={handleSaveChanges}
      handleDeleteCourse={handleDeleteCourse}
      handlePublishToggle={handlePublishToggle}
      canEdit={canEdit}
      editedCourse={editedCourse}
      setEditedCourse={setEditedCourse}
      actionType={actionType}
      isEditMode={isEditMode}
    />
  );
};

export default CourseDetailPage;
