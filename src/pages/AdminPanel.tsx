
import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/AdminLayout';
import DashboardHeader from '@/components/admin/dashboard/DashboardHeader';
import StatCards from '@/components/admin/dashboard/StatCards';
import DashboardTabs from '@/components/admin/dashboard/DashboardTabs';

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  
  // Redirect if not authenticated or not admin
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <AdminLayout pageTitle="Ադմինիստրատորի վահանակ">
      <DashboardHeader />
      <StatCards />
      <DashboardTabs />
    </AdminLayout>
  );
};

export default AdminPanel;
