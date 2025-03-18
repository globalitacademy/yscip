
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Import components
import CourseHeader from '@/components/courses/CourseDetails/CourseHeader';
import CoursePageLayout from '@/components/courses/CourseDetails/CoursePageLayout';
import CourseContent from '@/components/courses/CourseDetails/CourseContent';
import CourseLoadingState from '@/components/courses/CourseDetails/CourseLoadingState';
import CourseErrorState from '@/components/courses/CourseDetails/CourseErrorState';

// Import the custom hook
import { useCourseDetails } from '@/components/courses/hooks/useCourseDetails';

const CourseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Use the custom hook
  const { course, isLoading, error, form, updateCourse } = useCourseDetails(id);

  const handleGoBack = () => {
    navigate(-1);
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
