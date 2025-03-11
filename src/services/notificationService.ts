
import { supabase } from '@/integrations/supabase/client';
import { DBNotification } from '@/types/database.types';

export const getUserNotifications = async (userId: string): Promise<DBNotification[]> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error(`Error fetching notifications for user ${userId}:`, error);
    return [];
  }
  
  return data as DBNotification[];
};

export const getUnreadNotificationsCount = async (userId: string): Promise<number> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
    .eq('read', false);
  
  if (error) {
    console.error(`Error fetching unread notifications count for user ${userId}:`, error);
    return 0;
  }
  
  return data.length;
};

export const createNotification = async (notification: Omit<DBNotification, 'id' | 'created_at'>): Promise<boolean> => {
  const { error } = await supabase
    .from('notifications')
    .insert(notification);
  
  if (error) {
    console.error('Error creating notification:', error);
    return false;
  }
  
  return true;
};

export const markNotificationAsRead = async (id: number): Promise<boolean> => {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', id);
  
  if (error) {
    console.error(`Error marking notification ${id} as read:`, error);
    return false;
  }
  
  return true;
};

export const markAllNotificationsAsRead = async (userId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId);
  
  if (error) {
    console.error(`Error marking all notifications as read for user ${userId}:`, error);
    return false;
  }
  
  return true;
};

export const deleteNotification = async (id: number): Promise<boolean> => {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting notification ${id}:`, error);
    return false;
  }
  
  return true;
};

export const deleteAllNotifications = async (userId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('user_id', userId);
  
  if (error) {
    console.error(`Error deleting all notifications for user ${userId}:`, error);
    return false;
  }
  
  return true;
};
