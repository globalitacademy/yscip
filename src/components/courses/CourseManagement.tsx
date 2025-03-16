
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CourseProvider } from './CourseContext';
import CourseHeader from './CourseHeader';
import ProfessionalCourseTabView from './ProfessionalCourseTabView';

const CourseManagement: React.FC = () => {
  const { user } = useAuth();

  // Check if user has permissions to add courses
  const isAdmin = user?.role === 'admin';

  return (
    <CourseProvider>
      <div className="space-y-6">
        <CourseHeader canAddCourses={isAdmin} />
        <ProfessionalCourseTabView />
      </div>
    </CourseProvider>
  );
};

export default CourseManagement;
