
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/AdminLayout';
import DashboardHeader from '@/components/admin/dashboard/DashboardHeader';
import StatCards from '@/components/admin/dashboard/StatCards';
import DashboardTabs from '@/components/admin/dashboard/DashboardTabs';
import { Navigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <AdminLayout>
      <DashboardHeader />
      <StatCards />
      <DashboardTabs />
    </AdminLayout>
  );
};

export default AdminDashboard;
