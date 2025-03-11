
import React from 'react';
import { useAuth } from '@/contexts/auth';
import AdminLayout from '@/components/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminDashboardHeader from '@/components/dashboard/AdminDashboardHeader';
import AdminDashboardSummary from '@/components/dashboard/AdminDashboardSummary';
import AdminDashboardStats from '@/components/dashboard/AdminDashboardStats';
import AdminDashboardActivity from '@/components/dashboard/AdminDashboardActivity';
import AdminDashboardNotifications from '@/components/dashboard/AdminDashboardNotifications';

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <AdminDashboardHeader />
      <AdminDashboardSummary />

      <Tabs defaultValue="stats" className="mb-6">
        <TabsList className="mb-4 w-full md:w-auto overflow-x-auto">
          <TabsTrigger value="stats">Վիճակագրություն</TabsTrigger>
          <TabsTrigger value="activity">Գործողություններ</TabsTrigger>
          <TabsTrigger value="notifications">Ծանուցումներ</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stats">
          <AdminDashboardStats />
        </TabsContent>
        
        <TabsContent value="activity">
          <AdminDashboardActivity />
        </TabsContent>
        
        <TabsContent value="notifications">
          <AdminDashboardNotifications />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminDashboard;
