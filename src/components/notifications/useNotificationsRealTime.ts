
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Notification } from '@/types/notification';

export const useNotificationsRealTime = (
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>,
  userId: string | undefined
) => {
  useEffect(() => {
    if (!userId) return;

    const notificationsSubscription = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Notification real-time update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newNotification = payload.new as any;
            setNotifications(prev => [
              {
                id: newNotification.id,
                title: newNotification.title,
                message: newNotification.message,
                type: newNotification.type,
                read: newNotification.read,
                createdAt: new Date(newNotification.created_at),
                userId: newNotification.user_id
              },
              ...prev
            ]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedNotification = payload.new as any;
            setNotifications(prev => 
              prev.map(notification => {
                if (notification.id === updatedNotification.id) {
                  return {
                    id: updatedNotification.id,
                    title: updatedNotification.title,
                    message: updatedNotification.message,
                    type: updatedNotification.type,
                    read: updatedNotification.read,
                    createdAt: new Date(updatedNotification.created_at),
                    userId: updatedNotification.user_id
                  };
                }
                return notification;
              })
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedNotification = payload.old as any;
            setNotifications(prev => 
              prev.filter(notification => notification.id !== deletedNotification.id)
            );
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(notificationsSubscription);
    };
  }, [setNotifications, userId]);
};
