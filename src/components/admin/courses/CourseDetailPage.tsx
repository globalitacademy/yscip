
import React, { useEffect } from 'react';
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
  const navigate = useNavigate();
  
  // Use our custom hooks to handle different aspects of the course detail page
  const { 
    course, 
    setCourse, 
    loading: courseLoading, 
    editedCourse, 
    setEditedCourse,
    fetchCourse 
  } = useCourseDetails(id);
  
  const { actionType, handlePublishToggle } = useCourseStatusToggle(course, setCourse);
  const { isDeleteDialogOpen, setIsDeleteDialogOpen, handleDeleteCourse } = useCourseDelete(id);
  const { 
    isEditDialogOpen, 
    setIsEditDialogOpen, 
    handleSaveChanges,
    loading: editLoading 
  } = useCourseEdit(course, editedCourse, setEditedCourse, setCourse, isEditMode);

  // If course ID changes, refetch course data
  useEffect(() => {
    if (id) {
      console.log('Course ID changed, refetching course data for ID:', id);
      fetchCourse();
    }
  }, [id, fetchCourse]);

  // Automatically open edit dialog if in edit mode
  useEffect(() => {
    if (isEditMode && course && !isEditDialogOpen) {
      setIsEditDialogOpen(true);
      console.log('Automatically opening edit dialog in edit mode');
    }
  }, [isEditMode, course, isEditDialogOpen, setIsEditDialogOpen]);

  // Determine if user can edit the course
  const canEdit = user && (user.role === 'admin' || course?.createdBy === user.name);
  
  const loading = courseLoading || editLoading;
  
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
