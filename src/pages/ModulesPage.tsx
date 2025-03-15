
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import ModuleManagement from '@/components/admin/modules/ModuleManagement';

const ModulesPage: React.FC = () => {
  return (
    <AdminLayout pageTitle="Ուսումնական մոդուլների կառավարում">
      <ModuleManagement />
    </AdminLayout>
  );
};

export default ModulesPage;
