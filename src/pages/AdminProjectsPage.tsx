
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import AdminProjectGrid from '@/components/admin/projects/AdminProjectGrid';
import { ProjectManagementProvider } from '@/contexts/ProjectManagementContext';

const AdminProjectsPage: React.FC = () => {
  return (
    <AdminLayout pageTitle="Նախագծերի կառավարում">
      <ProjectManagementProvider>
        <AdminProjectGrid />
      </ProjectManagementProvider>
    </AdminLayout>
  );
};

export default AdminProjectsPage;
