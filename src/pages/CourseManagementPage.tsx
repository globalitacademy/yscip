
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import CourseManagement from '@/components/courses/CourseManagement';

const CourseManagementPage: React.FC = () => {
  return (
    <AdminLayout pageTitle="Դասընթացների կառավարում">
      <CourseManagement />
    </AdminLayout>
  );
};

export default CourseManagementPage;
