import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const login = async (email: string, password: string): Promise<boolean> => {
  try {
    console.log('Attempting login for:', email);
    console.log('Attempting to login with email:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Login error:', error);
      
      if (error.message.includes('Email not confirmed')) {
        toast.error('Էլ․ հասցեն չի հաստատվել', {
          description: 'Խնդրում ենք ստուգել Ձեր էլ․ փոստը հաստատման հղման համար'
        });
      } else if (error.message.includes('Invalid login credentials')) {
        toast.error('Սխալ մուտքի տվյալներ', {
          description: 'Խնդրում ենք ստուգել Ձեր էլ․ հասցեն և գաղտնաբառը'
        });
      } else {
        toast.error('Մուտքը չի հաջողվել', {
          description: error.message
        });
      }
      
      return false;
    }
    
    console.log('Login successful, got session:', data.session?.user.id);
    
    // If there's no session, something went wrong
    if (!data.session) {
      console.error('No session returned after login');
      toast.error('Մուտքը չի հաջողվել', {
        description: 'Տեղի ունեցավ անսպասելի սխալ'
      });
      return false;
    }
    
    // Add direct check for session user
    console.log('Login successful, navigating to appropriate page based on role');
    
    return true;
  } catch (error) {
    console.error('Unexpected login error:', error);
    toast.error('Սխալ', {
      description: 'Տեղի ունեցավ անսպասելի սխալ'
    });
    return false;
  }
};

export const logout = async (): Promise<void> => {
  try {
    console.log('Logging out user');
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Logout error:', error);
      toast.error('Ելքը չի հաջողվել', {
        description: error.message
      });
      return;
    }
    
    toast.success('Ելքն հաջողվել է', {
      description: 'Դուք հաջողությամբ դուրս եք եկել համակարգից'
    });
  } catch (error) {
    console.error('Unexpected logout error:', error);
    toast.error('Սխալ', {
      description: 'Տեղի ունեցավ անսպասելի սխալ'
    });
  }
};

export const sendVerificationEmail = async (email: string): Promise<boolean> => {
  try {
    console.log('Sending verification email to:', email);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email
    });
    
    if (error) {
      console.error('Error resending confirmation email:', error);
      toast.error('Հաստատման հղումը չի ուղարկվել: ' + error.message);
      return false;
    }
    
    console.log('Verification email sent successfully');
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
    console.log('Verifying email with token');
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
