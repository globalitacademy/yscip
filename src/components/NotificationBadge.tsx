
import React from 'react';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/useNotifications';

interface NotificationBadgeProps {
  className?: string;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ className }) => {
  const { unreadCount } = useNotifications();

  if (unreadCount === 0) {
    return <Bell className={className || "h-4 w-4"} />;
  }

  return (
    <div className="relative">
      <Bell className={className || "h-4 w-4"} />
      <Badge 
        variant="destructive" 
        className="absolute -top-2 -right-2 px-1 min-w-5 h-5 flex items-center justify-center text-[10px]"
      >
        {unreadCount > 99 ? '99+' : unreadCount}
      </Badge>
    </div>
  );
};

export default NotificationBadge;
