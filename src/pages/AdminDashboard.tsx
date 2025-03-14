
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/AdminLayout';
import DashboardHeader from '@/components/admin/dashboard/DashboardHeader';
import StatCards from '@/components/admin/dashboard/StatCards';
import DashboardTabs from '@/components/admin/dashboard/DashboardTabs';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // Ensure admin user and tables are properly configured
        await supabase.functions.invoke('ensure-admin-activation');
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };
    
    if (user?.role === 'admin') {
      checkAdminStatus();
    }
  }, [user]);
  
  // Allow access only for roles that should see the admin dashboard
  const allowedRoles = ['admin', 'lecturer', 'instructor', 'supervisor', 'project_manager'];
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    toast.error('Ձեզ հասանելի չէ այս էջը։');
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
