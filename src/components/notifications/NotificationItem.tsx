
import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, Info, AlertTriangle } from 'lucide-react';
import { DBNotification } from '@/types/database.types';

interface NotificationItemProps {
  notification: DBNotification;
  onMarkAsRead: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const getIconByType = (type: DBNotification['type']) => {
  switch (type) {
    case 'info': return <Info className="h-5 w-5 text-blue-500" />;
    case 'warning': return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    case 'success': return <Check className="h-5 w-5 text-green-500" />;
    case 'error': return <AlertTriangle className="h-5 w-5 text-red-500" />;
    default: return <Info className="h-5 w-5" />;
  }
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('hy-AM', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onMarkAsRead, 
  onDelete 
}) => {
  return (
    <div className="space-y-4">
      <div className={`flex gap-4 ${notification.read ? 'opacity-75' : 'bg-accent/30 p-2 rounded-md'}`}>
        <div className="mt-1">
          {getIconByType(notification.type)}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-medium">{notification.title}</h4>
            <span className="text-xs text-muted-foreground">
              {formatDate(notification.created_at)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
          <div className="flex gap-2">
            {!notification.read && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onMarkAsRead(notification.id)}
                className="h-7 px-2 text-xs"
              >
                Նշել կարդացված
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onDelete(notification.id)}
              className="h-7 px-2 text-xs text-destructive hover:text-destructive"
            >
              Հեռացնել
            </Button>
          </div>
        </div>
      </div>
      <Separator />
    </div>
  );
};

export default NotificationItem;
