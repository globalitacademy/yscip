
import { supabase } from '@/integrations/supabase/client';
import { DBUser } from '@/types/database.types';
import { toast } from 'sonner';

export const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Login error:', error);
      if (error.message === 'Invalid login credentials') {
        toast.error('Սխալ էլ․ հասցե կամ գաղտնաբառ');
      } else {
        toast.error('Մուտքը չի հաջողվել: ' + error.message);
      }
      return false;
    }
    
    if (!data.session) {
      toast.error('Մուտքը չի հաջողվել');
      return false;
    }
    
    // Մուտքը հաջողված է
    return true;
  } catch (error) {
    console.error('Unexpected login error:', error);
    toast.error('Տեղի ունեցավ անսպասելի սխալ');
    return false;
  }
};

export const logout = async () => {
  return await supabase.auth.signOut();
};

export const sendVerificationEmail = async (email: string): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email
    });
    
    if (error) {
      console.error('Error resending confirmation email:', error);
      toast.error('Հաստատման հղումը չի ուղարկվել: ' + error.message);
      return false;
    }
    
    toast.success('Հաստատման հղումը կրկին ուղարկված է Ձեր էլ․ փոստին։');
    return true;
  } catch (error) {
    console.error('Unexpected error sending verification email:', error);
    toast.error('Տեղի ունեցավ անսպասելի սխալ');
    return false;
  }
};

export const verifyEmail = async (token: string): Promise<boolean> => {
  try {
    // In a real implementation, this would verify the token with Supabase
    // For now, we'll just return true as Supabase handles email verification internally
    return true;
  } catch (error) {
    console.error('Error verifying email:', error);
    return false;
  }
};

export const resetPassword = async (email: string): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/login',
    });
    
    if (error) {
      console.error('Password reset error:', error);
      toast.error('Գաղտնաբառի վերականգնման սխալ: ' + error.message);
      return false;
    }
    
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
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) {
      console.error('Password update error:', error);
      toast.error('Գաղտնաբառի թարմացման սխալ: ' + error.message);
      return false;
    }
    
    toast.success('Գաղտնաբառը հաջողությամբ թարմացվել է։');
    return true;
  } catch (error) {
    console.error('Unexpected error updating password:', error);
    toast.error('Տեղի ունեցավ անսպասելի սխալ');
    return false;
  }
};
