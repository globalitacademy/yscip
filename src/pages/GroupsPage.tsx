
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import GroupManagement from '@/components/GroupManagement';

const GroupsPage: React.FC = () => {
  return (
    <AdminLayout pageTitle="Խմբեր">
      <GroupManagement />
    </AdminLayout>
  );
};

export default GroupsPage;
