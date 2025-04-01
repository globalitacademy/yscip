
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import ApplicationsList from '@/components/admin/courses/applications/ApplicationsList';

const CourseApplicationsPage: React.FC = () => {
  return (
    <AdminLayout pageTitle="Դասընթացների դիմումներ">
      <ApplicationsList />
    </AdminLayout>
  );
};

export default CourseApplicationsPage;
