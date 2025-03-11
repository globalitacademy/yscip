
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Check } from 'lucide-react';
import { DBNotification } from '@/types/database.types';
import NotificationItem from './NotificationItem';

interface NotificationListProps {
  notifications: DBNotification[];
  emptyMessage: string;
  emptyIcon: React.ReactNode;
  onMarkAsRead: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  emptyMessage,
  emptyIcon,
  onMarkAsRead,
  onDelete
}) => {
  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          {emptyIcon}
          <p>{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
              onDelete={onDelete}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationList;
