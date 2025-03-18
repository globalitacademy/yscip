
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Import components
import CourseHeader from '@/components/courses/CourseDetails/CourseHeader';
import CoursePageLayout from '@/components/courses/CourseDetails/CoursePageLayout';
import CourseContent from '@/components/courses/CourseDetails/CourseContent';
import CourseLoadingState from '@/components/courses/CourseDetails/CourseLoadingState';
import CourseErrorState from '@/components/courses/CourseDetails/CourseErrorState';
import { useAuth } from '@/contexts/AuthContext';

// Import the custom hook
import { useCourseDetails } from '@/components/courses/hooks/useCourseDetails';

const CourseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Use the custom hook
  const { course, isLoading, error, form, updateCourse } = useCourseDetails(id);

  const handleGoBack = () => {
    const isAdminUser = user && ['admin', 'lecturer', 'instructor', 'supervisor', 'project_manager'].includes(user.role);
    
    if (isAdminUser) {
      navigate('/admin/courses');
    } else {
      navigate('/'); // Navigate to homepage for regular users
    }
  };

  if (isLoading) {
    return (
      <CoursePageLayout>
        <CourseLoadingState />
      </CoursePageLayout>
    );
  }

  if (error || !course) {
    return (
      <CoursePageLayout>
        <CourseErrorState error={error} handleGoBack={handleGoBack} />
      </CoursePageLayout>
    );
  }

  return (
    <CoursePageLayout>
      <CourseHeader handleGoBack={handleGoBack} />
      <CourseContent 
        course={course}
        form={form}
        updateCourse={updateCourse}
      />
    </CoursePageLayout>
  );
};

export default CourseDetailsPage;
