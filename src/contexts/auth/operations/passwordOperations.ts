
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const resetPassword = async (email: string): Promise<boolean> => {
  try {
    console.log('Requesting password reset for email:', email);
    // Use the full URL of the application for password reset
    // Add type=recovery and email parameters to help with auto-login after reset
    const redirectTo = `${window.location.origin}/login#type=recovery&email=${encodeURIComponent(email)}`;
    console.log('Redirect URL for password reset:', redirectTo);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo,
    });
    
    if (error) {
      console.error('Password reset error:', error);
      toast.error('Գաղտնաբառի վերականգնման սխալ: ' + error.message);
      return false;
    }
    
    console.log('Password reset email sent successfully');
    toast.success('Գաղտնաբառը վերականգնելու հղումը ուղարկվել է Ձեր էլ․ փոստին։');
    return true;
  } catch (error) {
    console.error('Unexpected error sending password reset:', error);
    toast.error('Տեղի ունեցավ անսպասելի սխալ');
    return false;
  }
};

export const updatePassword = async (newPassword: string): Promise<boolean> => {
  try {
    console.log('Updating password...');
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) {
      console.error('Password update error:', error);
      toast.error('Գաղտնաբառի թարմացման սխալ: ' + error.message);
      return false;
    }
    
    console.log('Password updated successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error updating password:', error);
    toast.error('Տեղի ունեցավ անսպասելի սխալ');
    return false;
  }
};
