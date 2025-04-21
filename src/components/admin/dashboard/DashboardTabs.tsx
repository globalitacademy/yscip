
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatsTab from './tabs/StatsTab';
import ActivityTab from './tabs/ActivityTab';
import NotificationsTab from './tabs/NotificationsTab';
import ApplicationsTab from './tabs/ApplicationsTab';
import { useAuth } from '@/contexts/AuthContext';

const DashboardTabs: React.FC = () => {
  const { user } = useAuth();

  // Early return if no user
  if (!user) return null;
  
  // Determine which tabs to show based on user role
  const showApplicationsTab = ['admin', 'lecturer', 'instructor', 'supervisor', 'project_manager'].includes(user.role);
  
  return (
    <Tabs defaultValue="stats" className="mb-6">
      <TabsList className="mb-4 w-full md:w-auto overflow-x-auto">
        <TabsTrigger value="stats">Վիճակագրություն</TabsTrigger>
        {showApplicationsTab && <TabsTrigger value="applications">Դիմումներ</TabsTrigger>}
        <TabsTrigger value="activity">Գործողություններ</TabsTrigger>
        <TabsTrigger value="notifications">Ծանուցումներ</TabsTrigger>
      </TabsList>
      
      <TabsContent value="stats">
        <StatsTab />
      </TabsContent>
      
      {showApplicationsTab && (
        <TabsContent value="applications">
          <ApplicationsTab />
        </TabsContent>
      )}
      
      <TabsContent value="activity">
        <ActivityTab />
      </TabsContent>
      
      <TabsContent value="notifications">
        <NotificationsTab />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
