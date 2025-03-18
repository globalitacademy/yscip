
import { supabase } from '@/integrations/supabase/client';

type NotificationType = 'info' | 'warning' | 'success' | 'error';

export const addNotification = async (
  userId: string,
  title: string,
  message: string,
  type: NotificationType = 'info'
) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert([
        {
          user_id: userId,
          title,
          message,
          type,
          read: false
        }
      ]);
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error adding notification:', error);
    return { success: false, error };
  }
};

export const addSystemNotification = async (
  userId: string,
  title: string,
  message: string,
  type: NotificationType = 'info'
) => {
  try {
    // Use the Supabase function to create a notification
    const { error } = await supabase.rpc('create_notification', {
      p_user_id: userId,
      p_title: title,
      p_message: message,
      p_type: type
    });
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error adding system notification:', error);
    return { success: false, error };
  }
};
