
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatsTab from './tabs/StatsTab';
import NotificationsTab from './tabs/NotificationsTab';
import ActivityTab from './tabs/ActivityTab';
import { LineChart, Bell, Activity, Users } from 'lucide-react';
import AccountManagementTab from './AccountManagementTab';

const DashboardTabs: React.FC = () => {
  return (
    <Tabs defaultValue="stats" className="space-y-4">
      <TabsList>
        <TabsTrigger value="stats" className="flex items-center gap-1">
          <LineChart className="h-4 w-4" />
          <span className="hidden md:inline">Վիճակագրություն</span>
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center gap-1">
          <Bell className="h-4 w-4" />
          <span className="hidden md:inline">Ծանուցումներ</span>
        </TabsTrigger>
        <TabsTrigger value="activity" className="flex items-center gap-1">
          <Activity className="h-4 w-4" />
          <span className="hidden md:inline">Ակտիվություն</span>
        </TabsTrigger>
        <TabsTrigger value="accounts" className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          <span className="hidden md:inline">Հաշիվներ</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="stats" className="space-y-4">
        <StatsTab />
      </TabsContent>
      <TabsContent value="notifications" className="space-y-4">
        <NotificationsTab />
      </TabsContent>
      <TabsContent value="activity" className="space-y-4">
        <ActivityTab />
      </TabsContent>
      <TabsContent value="accounts" className="space-y-4">
        <AccountManagementTab />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
