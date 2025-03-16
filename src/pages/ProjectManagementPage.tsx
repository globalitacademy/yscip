
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import AdminProjectGrid from '@/components/admin/projects/AdminProjectGrid';

const ProjectManagementPage: React.FC = () => {
  return (
    <AdminLayout pageTitle="Նախագծերի կառավարում">
      <AdminProjectGrid />
    </AdminLayout>
  );
};

export default ProjectManagementPage;
