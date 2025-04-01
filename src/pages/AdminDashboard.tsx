
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/AdminLayout';
import DashboardHeader from '@/components/admin/dashboard/DashboardHeader';
import StatCards from '@/components/admin/dashboard/StatCards';
import DashboardTabs from '@/components/admin/dashboard/DashboardTabs';
import { Navigate } from 'react-router-dom';
import { useCourseApplications } from '@/hooks/useCourseApplications';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { fetchApplications } = useCourseApplications();
  
  // Load applications when the dashboard mounts
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <AdminLayout pageTitle="Կառավարման վահանակ">
      <DashboardHeader />
      <StatCards />
      <DashboardTabs />
    </AdminLayout>
  );
};

export default AdminDashboard;
