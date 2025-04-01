
import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useCourseContext } from '@/contexts/CourseContext';
import ProjectFormFooter from '../project-creation/ProjectFormFooter';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import CourseFormHeader from './CourseFormHeader';
import CourseFormTabs from './CourseFormTabs';
import { useFormValidation } from './hooks/useFormValidation';
import { useCourseFormSubmission } from './hooks/useCourseFormSubmission';

const CourseCreationForm: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const { 
    professionalCourse,
    courseType,
    setCourseType,
    setProfessionalCourse,
    handleCreateProfessionalCourse
  } = useCourseContext();

  // Form validation hook
  const { isFormValid, validateCourse } = useFormValidation(professionalCourse);

  // Form submission hook
  const { isLoading, handleSubmit } = useCourseFormSubmission({
    professionalCourse,
    handleCreateProfessionalCourse,
    validateCourse,
    user,
    isAuthenticated
  });

  // Force courseType to 'professional' on component mount
  useEffect(() => {
    setCourseType('professional');
  }, [setCourseType]);

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <Card className="shadow-sm">
      <CourseFormHeader />
      <CourseFormTabs 
        courseType={courseType}
        setCourseType={setCourseType}
        professionalCourse={professionalCourse}
        setProfessionalCourse={setProfessionalCourse}
      />
      <ProjectFormFooter 
        onSubmit={handleSubmit} 
        submitButtonText="Ստեղծել դասընթաց" 
        isDisabled={!isFormValid || isLoading}
      />
    </Card>
  );
};

export default CourseCreationForm;
