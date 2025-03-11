
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NotificationActionsProps {
  totalCount: number;
  unreadCount: number;
  onMarkAllAsRead: () => Promise<void>;
  onClearAll: () => Promise<void>;
}

const NotificationActions: React.FC<NotificationActionsProps> = ({
  totalCount,
  unreadCount,
  onMarkAllAsRead,
  onClearAll
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <h3 className="text-xl font-semibold">Ծանուցումներ</h3>
        {unreadCount > 0 && (
          <Badge variant="destructive">{unreadCount} նոր</Badge>
        )}
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onMarkAllAsRead} 
          disabled={unreadCount === 0}
        >
          Նշել բոլորը կարդացված
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onClearAll} 
          disabled={totalCount === 0}
        >
          Մաքրել բոլորը
        </Button>
      </div>
    </div>
  );
};

export default NotificationActions;
