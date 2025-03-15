
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import OrganizationManagement from '@/components/OrganizationManagement';

const OrganizationsPage: React.FC = () => {
  return (
    <AdminLayout pageTitle="Կազմակերպություններ">
      <OrganizationManagement />
    </AdminLayout>
  );
};

export default OrganizationsPage;
