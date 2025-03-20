
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import CourseManagement from '@/components/courses/CourseManagement';

const CoursesPage: React.FC = () => {
  return (
    <AdminLayout pageTitle="Կուրսեր">
      <CourseManagement />
    </AdminLayout>
  );
};

export default CoursesPage;
