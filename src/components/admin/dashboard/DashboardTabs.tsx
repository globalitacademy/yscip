
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatsTab from './tabs/StatsTab';
import ActivityTab from './tabs/ActivityTab';
import NotificationsTab from './tabs/NotificationsTab';

const DashboardTabs: React.FC = () => {
  return (
    <Tabs defaultValue="stats" className="mb-6">
      <TabsList className="mb-4 w-full md:w-auto overflow-x-auto">
        <TabsTrigger value="stats">Վիճակագրություն</TabsTrigger>
        <TabsTrigger value="activity">Գործողություններ</TabsTrigger>
        <TabsTrigger value="notifications">Ծանուցումներ</TabsTrigger>
      </TabsList>
      
      <TabsContent value="stats">
        <StatsTab />
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
