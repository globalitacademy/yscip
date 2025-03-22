
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CourseProvider } from './CourseContext';
import CourseHeader from './CourseHeader';
import ProfessionalCourseTabView from './ProfessionalCourseTabView';
import { useProjectPermissions } from '@/hooks/useProjectPermissions';

const CourseManagement: React.FC = () => {
  const { user } = useAuth();
  const permissions = useProjectPermissions(user?.role);

  // Check if user has permissions to add courses
  const canAddCourses = permissions.canCreateProjects || user?.role === 'admin';

  return (
    <CourseProvider>
      <div className="space-y-6">
        <CourseHeader canAddCourses={canAddCourses} />
        <ProfessionalCourseTabView />
      </div>
    </CourseProvider>
  );
};

export default CourseManagement;
