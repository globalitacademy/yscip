
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { DBNotification } from '@/types/database.types';
import { 
  getUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotification, 
  deleteAllNotifications 
} from '@/services/notificationService';

export const useNotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<DBNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!user) return;
    
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

  useEffect(() => {
    if (!user) return;

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

  const handleMarkAsRead = async (id: number) => {
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

  const handleMarkAllAsRead = async () => {
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

  const handleDeleteNotification = async (id: number) => {
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

  const handleClearAllNotifications = async () => {
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

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    loading,
    unreadCount,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDeleteNotification,
    handleClearAllNotifications
  };
};
