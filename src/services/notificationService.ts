
import { supabase } from '@/integrations/supabase/client';
import { DBNotification } from '@/types/database.types';

// Get notifications for a user
export const getUserNotifications = async (userId: string): Promise<DBNotification[]> => {
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
    
    return data as DBNotification[];
  } catch (error) {
    console.error('Unexpected error fetching notifications:', error);
    return [];
  }
};

// Count unread notifications
export const getUnreadNotificationsCount = async (userId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);
    
    if (error) {
      console.error('Error counting unread notifications:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Unexpected error counting unread notifications:', error);
    return 0;
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId: number): Promise<boolean> => {
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
    console.error('Unexpected error marking notification as read:', error);
    return false;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (userId: string): Promise<boolean> => {
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
    console.error('Unexpected error marking all notifications as read:', error);
    return false;
  }
};

// Create a notification
export const createNotification = async (
  userId: string, 
  title: string, 
  message: string, 
  type: 'info' | 'warning' | 'success' | 'error'
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        read: false
      });
    
    if (error) {
      console.error('Error creating notification:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error creating notification:', error);
    return false;
  }
};
