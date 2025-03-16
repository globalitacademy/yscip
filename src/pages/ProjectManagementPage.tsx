
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import ProjectManagement from '@/components/ProjectManagement';

const ProjectManagementPage: React.FC = () => {
  return (
    <AdminLayout pageTitle="Նախագծերի կառավարում">
      <ProjectManagement />
    </AdminLayout>
  );
};

export default ProjectManagementPage;
