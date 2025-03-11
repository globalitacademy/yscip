
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bell, Check, Clock, Info, AlertTriangle, MessageSquare, Users, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotification, 
  deleteAllNotifications 
} from '@/services/notificationService';
import { DBNotification } from '@/types/database.types';
import { supabase } from '@/integrations/supabase/client';

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<DBNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const data = await getUserNotifications(user.id);
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast.error('Չհաջողվեց ստանալ ծանուցումները');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Set up real-time subscription for notifications
    const channel = supabase
      .channel('public:notifications')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        console.log('Notifications change received:', payload);
        
        // Refresh notifications when a change is detected
        fetchNotifications();
        
        // Show toast for new notifications
        if (payload.eventType === 'INSERT') {
          const newNotification = payload.new as DBNotification;
          toast.info(`Նոր ծանուցում: ${newNotification.title}`);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markAsRead = async (id: number) => {
    try {
      const success = await markNotificationAsRead(id);
      if (success) {
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === id ? {...notification, read: true} : notification
          )
        );
        toast.success('Ծանուցումը նշվեց որպես կարդացված');
      } else {
        toast.error('Չհաջողվեց թարմացնել ծանուցումը');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Տեղի ունեցավ սխալ');
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      const success = await markAllNotificationsAsRead(user.id);
      if (success) {
        setNotifications(prev => 
          prev.map(notification => ({...notification, read: true}))
        );
        toast.success('Բոլոր ծանուցումները նշվեցին որպես կարդացված');
      } else {
        toast.error('Չհաջողվեց թարմացնել ծանուցումները');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Տեղի ունեցավ սխալ');
    }
  };

  const deleteNotificationHandler = async (id: number) => {
    try {
      const success = await deleteNotification(id);
      if (success) {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
        toast.success('Ծանուցումը հեռացվեց');
      } else {
        toast.error('Չհաջողվեց հեռացնել ծանուցումը');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Տեղի ունեցավ սխալ');
    }
  };

  const clearAllNotifications = async () => {
    if (!user) return;
    
    try {
      const success = await deleteAllNotifications(user.id);
      if (success) {
        setNotifications([]);
        toast.success('Բոլոր ծանուցումները հեռացվեցին');
      } else {
        toast.error('Չհաջողվեց հեռացնել ծանուցումները');
      }
    } catch (error) {
      console.error('Error clearing all notifications:', error);
      toast.error('Տեղի ունեցավ սխալ');
    }
  };

  const getIconByType = (type: DBNotification['type']) => {
    switch (type) {
      case 'info': return <Info className="h-5 w-5 text-blue-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'success': return <Check className="h-5 w-5 text-green-500" />;
      case 'error': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('hy-AM', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold">Ծանուցումներ</h3>
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount} նոր</Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
              Նշել բոլորը կարդացված
            </Button>
            <Button variant="outline" size="sm" onClick={clearAllNotifications} disabled={notifications.length === 0}>
              Մաքրել բոլորը
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">Բոլորը ({notifications.length})</TabsTrigger>
            <TabsTrigger value="unread">Չկարդացված ({unreadCount})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Bell className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p>Ծանուցումներ չկան</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="space-y-4">
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
                                  onClick={() => markAsRead(notification.id)}
                                  className="h-7 px-2 text-xs"
                                >
                                  Նշել կարդացված
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => deleteNotificationHandler(notification.id)}
                                className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                              >
                                Հեռացնել
                              </Button>
                            </div>
                          </div>
                        </div>
                        <Separator />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="unread">
            {unreadCount === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Check className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p>Չկարդացված ծանուցումներ չկան</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {notifications.filter(n => !n.read).map((notification) => (
                      <div key={notification.id} className="space-y-4">
                        <div className="flex gap-4 bg-accent/30 p-2 rounded-md">
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
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => markAsRead(notification.id)}
                                className="h-7 px-2 text-xs"
                              >
                                Նշել կարդացված
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => deleteNotificationHandler(notification.id)}
                                className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                              >
                                Հեռացնել
                              </Button>
                            </div>
                          </div>
                        </div>
                        <Separator />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default NotificationsPage;
