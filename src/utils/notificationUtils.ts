
import { supabase } from '@/integrations/supabase/client';

export type NotificationType = 'info' | 'warning' | 'success' | 'error';

// Validate notification type to ensure it matches allowed values
const validateNotificationType = (type: string): NotificationType => {
  if (['info', 'warning', 'success', 'error'].includes(type)) {
    return type as NotificationType;
  }
  return 'info'; // Default fallback
};

export const addNotification = async (
  userId: string,
  title: string,
  message: string,
  type: NotificationType = 'info'
) => {
  try {
    // Ensure type is valid
    const validType = validateNotificationType(type);
    
    const { data, error } = await supabase
      .from('notifications')
      .insert([
        {
          user_id: userId,
          title,
          message,
          type: validType,
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
    // Ensure type is valid
    const validType = validateNotificationType(type);
    
    // Use the Supabase function to create a notification
    const { error } = await supabase.rpc('create_notification', {
      p_user_id: userId,
      p_title: title,
      p_message: message,
      p_type: validType
    });
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error adding system notification:', error);
    return { success: false, error };
  }
};
