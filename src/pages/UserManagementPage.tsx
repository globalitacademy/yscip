
import React from 'react';
import UserManagement from '@/components/user-management/UserManagement';
import AdminLayout from '@/components/AdminLayout';

const UserManagementPage: React.FC = () => {
  return (
    <AdminLayout pageTitle="Օգտատերերի կառավարում">
      <UserManagement />
    </AdminLayout>
  );
};

export default UserManagementPage;
