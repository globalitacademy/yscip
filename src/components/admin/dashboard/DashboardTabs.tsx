
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatsTab from './tabs/StatsTab';
import ActivityTab from './tabs/ActivityTab';
import NotificationsTab from './tabs/NotificationsTab';
import ApplicationsTab from './tabs/ApplicationsTab';
import ModuleManagement from '../modules/ModuleManagement';

const DashboardTabs: React.FC = () => {
  return (
    <Tabs defaultValue="modules" className="mb-6">
      <TabsList className="mb-4 w-full md:w-auto overflow-x-auto">
        <TabsTrigger value="modules">Մոդուլներ</TabsTrigger>
        <TabsTrigger value="stats">Վիճակագրություն</TabsTrigger>
        <TabsTrigger value="applications">Դիմումներ</TabsTrigger>
        <TabsTrigger value="activity">Գործողություններ</TabsTrigger>
        <TabsTrigger value="notifications">Ծանուցումներ</TabsTrigger>
      </TabsList>
      
      <TabsContent value="modules">
        <ModuleManagement />
      </TabsContent>

      <TabsContent value="stats">
        <StatsTab />
      </TabsContent>
      
      <TabsContent value="applications">
        <ApplicationsTab />
      </TabsContent>
      
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
