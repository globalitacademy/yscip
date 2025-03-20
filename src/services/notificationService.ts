
import { supabase } from '@/integrations/supabase/client';
import { Notification } from '@/types/notification';

export const notificationService = {
  /**
   * Get notifications for a user
   */
  async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }

      return (data || []).map(item => ({
        id: item.id,
        title: item.title,
        message: item.message,
        type: item.type,
        read: item.read,
        createdAt: new Date(item.created_at),
        userId: item.user_id
      }));
    } catch (error) {
      console.error('Error in getUserNotifications:', error);
      return [];
    }
  },

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in markAsRead:', error);
      return false;
    }
  },

  /**
   * Create a new notification
   */
  async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          title: notification.title,
          message: notification.message,
          type: notification.type,
          read: notification.read,
          user_id: notification.userId
        });

      if (error) {
        console.error('Error creating notification:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in createNotification:', error);
      return false;
    }
  },

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        console.error('Error deleting notification:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteNotification:', error);
      return false;
    }
  },

  /**
   * Create a system notification for all users
   */
  async createSystemNotification(title: string, message: string, userIds: string[]): Promise<boolean> {
    try {
      const notifications = userIds.map(userId => ({
        title,
        message,
        type: 'system',
        read: false,
        user_id: userId
      }));

      const { error } = await supabase
        .from('notifications')
        .insert(notifications);

      if (error) {
        console.error('Error creating system notifications:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in createSystemNotification:', error);
      return false;
    }
  },

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) {
        console.error('Error marking all notifications as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in markAllAsRead:', error);
      return false;
    }
  }
};
