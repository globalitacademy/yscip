
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import OrganizationManagement from '@/components/OrganizationManagement';

const OrganizationManagementPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Կազմակերպությունների կառավարում</h1>
        <OrganizationManagement />
      </div>
    </AdminLayout>
  );
};

export default OrganizationManagementPage;
