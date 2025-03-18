
import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Check, Trash2, Bell, Info, AlertTriangle, CheckCheck } from 'lucide-react';
import { useNotifications, Notification } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { hy } from 'date-fns/locale';

interface NotificationsDropdownProps {
  onClose: () => void;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ onClose }) => {
  const { 
    notifications, 
    loading, 
    unreadCount,
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'success': return <Check className="h-4 w-4 text-green-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: hy
      });
    } catch (error) {
      return 'անհայտ ժամանակ';
    }
  };

  const handleViewAll = () => {
    navigate('/admin/notifications');
    onClose();
  };

  return (
    <Card 
      ref={dropdownRef} 
      className="absolute right-0 mt-2 w-80 md:w-96 z-50 shadow-lg overflow-hidden"
    >
      <div className="p-3 flex items-center justify-between bg-muted/50">
        <h3 className="font-medium">Ծանուցումներ</h3>
        {unreadCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-xs" 
            onClick={() => markAllAsRead()}
          >
            <CheckCheck className="mr-1 h-3 w-3" />
            Նշել բոլորը կարդացված
          </Button>
        )}
      </div>
      
      <div className="max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-muted-foreground">
            Բեռնում...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            Ծանուցումներ չկան
          </div>
        ) : (
          <div>
            {notifications.slice(0, 5).map((notification) => (
              <div key={notification.id}>
                <div className={`p-3 ${!notification.read ? 'bg-accent/20' : ''}`}>
                  <div className="flex gap-3">
                    <div className="mt-0.5">{getTypeIcon(notification.type)}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-medium">{notification.title}</h4>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(notification.created_at)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground my-1">{notification.message}</p>
                      <div className="flex gap-2">
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2 text-xs"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Նշել կարդացված
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => deleteNotification(notification.id)}
                          className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Հեռացնել
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <Separator />
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-2 bg-muted/20 text-center">
        <Button variant="ghost" size="sm" onClick={handleViewAll}>
          Դիտել բոլոր ծանուցումները
        </Button>
      </div>
    </Card>
  );
};

export default NotificationsDropdown;
