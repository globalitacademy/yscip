
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

const DashboardHeader: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <h1 className="text-2xl md:text-3xl font-bold">Ադմինիստրատորի վահանակ</h1>
    </div>
  );
};

export default DashboardHeader;
