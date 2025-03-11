
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
    console.log('Starting password update process...');
    
    if (!newPassword || newPassword.length < 6) {
      toast.error('Անվավեր գաղտնաբառ', {
        description: 'Գաղտնաբառը պետք է պարունակի առնվազն 6 նիշ'
      });
      return false;
    }
    
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      console.error('Password update error:', error);
      if (error.message.includes('Auth session missing')) {
        toast.error('Սեսիան ավարտվել է', {
          description: 'Խնդրում ենք նորից մուտք գործել համակարգ'
        });
      } else {
        toast.error('Գաղտնաբառի թարմացման սխալ', {
          description: error.message
        });
      }
      return false;
    }

    if (!data.user) {
      console.error('No user data returned after password update');
      toast.error('Գաղտնաբառի թարմացման սխալ', {
        description: 'Օգտատերը չի գտնվել'
      });
      return false;
    }

    console.log('Password updated successfully');
    toast.success('Գաղտնաբառը հաջողությամբ թարմացվել է');
    return true;
  } catch (error) {
    console.error('Unexpected error updating password:', error);
    toast.error('Տեղի ունեցավ անսպասելի սխալ');
    return false;
  }
};
