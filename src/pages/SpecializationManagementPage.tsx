
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import SpecializationManagement from '@/components/SpecializationManagement';

const SpecializationManagementPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Մասնագիտությունների կառավարում</h1>
        <SpecializationManagement />
      </div>
    </AdminLayout>
  );
};

export default SpecializationManagementPage;
