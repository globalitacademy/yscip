
import { supabase } from '@/integrations/supabase/client';

interface CreateNotificationParams {
  userId?: string;
  title: string;
  message: string;
  type: 'user' | 'course' | 'warning' | 'info' | 'success' | 'message' | 'project';
}

export const createNotification = async ({
  userId,
  title,
  message,
  type
}: CreateNotificationParams) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        read: false
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error };
  }
};

export const getNotificationTimeSince = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const secondsDiff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (secondsDiff < 60) {
    return 'հենց նոր';
  }
  
  const minutesDiff = Math.floor(secondsDiff / 60);
  if (minutesDiff < 60) {
    return `${minutesDiff} րոպե առաջ`;
  }
  
  const hoursDiff = Math.floor(minutesDiff / 60);
  if (hoursDiff < 24) {
    return `${hoursDiff} ժամ առաջ`;
  }
  
  const daysDiff = Math.floor(hoursDiff / 24);
  if (daysDiff < 7) {
    return `${daysDiff} օր առաջ`;
  }
  
  const weeksDiff = Math.floor(daysDiff / 7);
  if (weeksDiff < 4) {
    return `${weeksDiff} շաբաթ առաջ`;
  }
  
  const monthsDiff = Math.floor(daysDiff / 30);
  if (monthsDiff < 12) {
    return `${monthsDiff} ամիս առաջ`;
  }
  
  const yearsDiff = Math.floor(daysDiff / 365);
  return `${yearsDiff} տարի առաջ`;
};
