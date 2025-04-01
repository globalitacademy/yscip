
import React, { useEffect, useState } from 'react';
import { Bell, User, Calendar, MessageSquare, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  created_at: string;
  read: boolean;
}

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Սխալ ծանուցումները բեռնելիս');
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      const unreadIds = notifications
        .filter(notification => !notification.read)
        .map(notification => notification.id);
      
      if (unreadIds.length === 0) {
        toast.info('Չկան չկարդացված ծանուցումներ');
        return;
      }
      
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .in('id', unreadIds);
      
      if (error) {
        throw error;
      }
      
      setNotifications(notifications.map(notification => ({
        ...notification,
        read: true
      })));
      
      toast.success('Բոլոր ծանուցումները նշված են որպես կարդացված');
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      toast.error('Սխալ ծանուցումները թարմացնելիս');
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setNotifications(notifications.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      ));
      
      toast.success('Ծանուցումը նշված է որպես կարդացված');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Սխալ ծանուցումը թարմացնելիս');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('hy-AM', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'user':
        return <User className="h-5 w-5 text-blue-500" />;
      case 'course':
        return <Calendar className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-amber-500" />;
    }
  };

  return (
    <AdminLayout pageTitle="Ծանուցումներ">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Ծանուցումներ
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={markAllAsRead}
            disabled={loading || notifications.every(n => n.read)}
          >
            Նշել բոլորը որպես կարդացված
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Ծանուցումների բեռնում...</p>
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`flex items-start p-4 rounded-md ${
                    notification.read ? 'bg-muted/50' : 'bg-muted/80 border-l-4 border-primary'
                  }`}
                >
                  <div className="flex-shrink-0 mr-4">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{notification.title}</h4>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(notification.created_at)}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{notification.message}</p>
                  </div>
                  {!notification.read && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="ml-2" 
                      onClick={() => markAsRead(notification.id)}
                    >
                      Նշել որպես կարդացված
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Bell className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Դուք չունեք ծանուցումներ</p>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default NotificationsPage;
