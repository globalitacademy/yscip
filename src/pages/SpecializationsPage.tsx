
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import SpecializationManagement from '@/components/SpecializationManagement';

const SpecializationsPage: React.FC = () => {
  return (
    <AdminLayout pageTitle="Մասնագիտացումներ">
      <SpecializationManagement />
    </AdminLayout>
  );
};

export default SpecializationsPage;
