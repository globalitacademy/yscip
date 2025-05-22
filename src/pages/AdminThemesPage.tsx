
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import ThemeManagement from '@/components/admin/themes/ThemeManagement';

const AdminThemesPage: React.FC = () => {
  return (
    <AdminLayout pageTitle="Ուսումնական թեմաների կառավարում">
      <ThemeManagement />
    </AdminLayout>
  );
};

export default AdminThemesPage;
