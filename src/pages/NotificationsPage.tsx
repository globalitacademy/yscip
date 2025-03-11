
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Check } from 'lucide-react';
import NotificationList from '@/components/notifications/NotificationList';
import NotificationActions from '@/components/notifications/NotificationActions';
import { useNotificationsPage } from '@/hooks/useNotificationsPage';

const NotificationsPage: React.FC = () => {
  const {
    notifications,
    loading,
    unreadCount,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDeleteNotification,
    handleClearAllNotifications
  } = useNotificationsPage();

  if (loading) {
    return (
      <AdminLayout pageTitle="Ծանուցումներ">
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Ծանուցումների բեռնում...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Ծանուցումներ">
      <div className="space-y-6">
        <NotificationActions
          totalCount={notifications.length}
          unreadCount={unreadCount}
          onMarkAllAsRead={handleMarkAllAsRead}
          onClearAll={handleClearAllNotifications}
        />

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">Բոլորը ({notifications.length})</TabsTrigger>
            <TabsTrigger value="unread">Չկարդացված ({unreadCount})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <NotificationList
              notifications={notifications}
              emptyMessage="Ծանուցումներ չկան"
              emptyIcon={<Bell className="mx-auto h-8 w-8 text-muted-foreground mb-2" />}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDeleteNotification}
            />
          </TabsContent>
          
          <TabsContent value="unread">
            <NotificationList
              notifications={notifications.filter(n => !n.read)}
              emptyMessage="Չկարդացված ծանուցումներ չկան"
              emptyIcon={<Check className="mx-auto h-8 w-8 text-muted-foreground mb-2" />}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDeleteNotification}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default NotificationsPage;
