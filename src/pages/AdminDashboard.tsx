
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/AdminLayout';
import DashboardHeader from '@/components/admin/dashboard/DashboardHeader';
import StatCards from '@/components/admin/dashboard/StatCards';
import DashboardTabs from '@/components/admin/dashboard/DashboardTabs';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.warning('Այս էջը մատչելի է միայն ադմինիստրատորների համար։');
    }
  }, [user]);
  
  // If user isn't logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // If user isn't an admin, redirect to home
  if (user.role !== 'admin') {
    return <Navigate to="/" />;
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
