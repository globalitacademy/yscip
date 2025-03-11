
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Get all users pending approval
export const getPendingApprovals = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('registration_approved', false)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching pending approvals:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching pending approvals:', error);
    toast.error('Սխալ հաստատման սպասող հաշիվների ստացման ժամանակ');
    return [];
  }
};

// Approve a user account
export const approveUserAccount = async (userId: string) => {
  try {
    // Update user's approval status
    const { error } = await supabase
      .from('users')
      .update({ registration_approved: true })
      .eq('id', userId);
    
    if (error) {
      console.error('Error approving user account:', error);
      toast.error('Հաշվի հաստատման սխալ');
      return false;
    }
    
    // Create notification for the user
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title: 'Հաշիվը հաստատված է',
        message: 'Ձեր հաշիվը հաստատվել է ադմինիստրատորի կողմից։ Դուք այժմ կարող եք օգտվել համակարգից։',
        type: 'success'
      });
    
    if (notificationError) {
      console.error('Error creating notification:', notificationError);
      // Don't fail the operation if notification creation fails
    }
    
    toast.success('Օգտատիրոջ հաշիվը հաջողությամբ հաստատվել է');
    return true;
  } catch (error) {
    console.error('Unexpected error approving user account:', error);
    toast.error('Անսպասելի սխալ հաշվի հաստատման ժամանակ');
    return false;
  }
};

// Reject a user account
export const rejectUserAccount = async (userId: string, reason: string) => {
  try {
    // Create notification for the user explaining rejection
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title: 'Հաշվի հաստատումը մերժվել է',
        message: `Ձեր հաշվի հաստատումը մերժվել է: ${reason}`,
        type: 'error'
      });
    
    if (notificationError) {
      console.error('Error creating rejection notification:', notificationError);
      toast.error('Սխալ ծանուցման ստեղծման ժամանակ');
      return false;
    }
    
    toast.success('Օգտատիրոջը ուղարկվել է մերժման ծանուցում');
    return true;
  } catch (error) {
    console.error('Unexpected error rejecting user account:', error);
    toast.error('Անսպասելի սխալ հաշվի մերժման ժամանակ');
    return false;
  }
};
