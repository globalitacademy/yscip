
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

const DashboardHeader: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      {/* Remove the duplicate title since AdminLayout already provides it */}
    </div>
  );
};

export default DashboardHeader;
