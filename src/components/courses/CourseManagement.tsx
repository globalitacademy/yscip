
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CourseProvider } from './CourseContext';
import CourseHeader from './CourseHeader';
import CourseTabView from './CourseTabView';
import { useCourseManagement } from './useCourseManagement';
import { useInitializeFeaturedCourses } from './hooks/useInitializeFeaturedCourses';

const CourseManagement: React.FC = () => {
  const { user } = useAuth();
  const { setIsAddDialogOpen } = useCourseManagement();
  const { initializeFeaturedCourses } = useInitializeFeaturedCourses();

  // Check if user has permissions to add courses
  const isAdmin = user?.role === 'admin';
  const isLecturer = ['lecturer', 'instructor', 'supervisor', 'project_manager'].includes(user?.role || '');
  const canAddCourses = isAdmin || isLecturer;

  return (
    <CourseProvider>
      <div className="space-y-6">
        <CourseHeader 
          canAddCourses={canAddCourses} 
          onAddCourse={() => setIsAddDialogOpen(true)} 
          onInitializeCourses={isAdmin ? initializeFeaturedCourses : undefined}
        />
        <CourseTabView />
      </div>
    </CourseProvider>
  );
};

export default CourseManagement;
