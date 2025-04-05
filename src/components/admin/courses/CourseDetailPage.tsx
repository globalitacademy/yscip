
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCourseDetails } from '@/hooks/courseService/useCourseDetails';
import { useCourseStatusToggle } from '@/hooks/courseService/useCourseStatusToggle';
import { useCourseDelete } from '@/hooks/courseService/useCourseDelete';
import CourseWrapper from './course-detail/CourseWrapper';

interface CourseDetailPageProps {
  id?: string;
}

export const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ id }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Use our custom hooks to handle different aspects of the course detail page
  const { 
    course, 
    setCourse, 
    loading: courseLoading, 
    fetchCourse 
  } = useCourseDetails(id);
  
  const { actionType, handlePublishToggle } = useCourseStatusToggle(course, setCourse);
  const { isDeleteDialogOpen, setIsDeleteDialogOpen, handleDeleteCourse } = useCourseDelete(id);

  // If course ID changes, refetch course data
  useEffect(() => {
    if (id) {
      console.log('Course ID changed, refetching course data for ID:', id);
      fetchCourse();
    }
  }, [id, fetchCourse]);

  // Determine if user can edit the course
  const canEdit = user && (user.role === 'admin' || course?.createdBy === user.name);
  
  const loading = courseLoading;
  
  return (
    <CourseWrapper
      course={course}
      loading={loading}
      isDeleteDialogOpen={isDeleteDialogOpen}
      setIsDeleteDialogOpen={setIsDeleteDialogOpen}
      handleDeleteCourse={handleDeleteCourse}
      handlePublishToggle={handlePublishToggle}
      canEdit={canEdit}
      actionType={actionType}
    />
  );
};

export default CourseDetailPage;
