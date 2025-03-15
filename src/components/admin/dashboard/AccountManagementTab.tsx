
import React from 'react';
import DemoAccountsManager from '@/components/auth/DemoAccountsManager';
import RealAccountsManager from '@/components/auth/RealAccountsManager';
import AdminReset from '@/components/AdminReset';

const AccountManagementTab: React.FC = () => {
  return (
    <div className="space-y-8">
      <DemoAccountsManager />
      <RealAccountsManager />
      <AdminReset />
    </div>
  );
};

export default AccountManagementTab;
