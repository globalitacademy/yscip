
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const resetAdminAccount = async (): Promise<boolean> => {
  try {
    console.log('Resetting admin account');
    
    // Call the improved database function to reset the admin account
    const { data, error } = await supabase.rpc('reset_admin_account');
    
    if (error) {
      console.error('Error resetting admin account:', error);
      toast.error('Հաշվի վերակայման սխալ', {
        description: error.message
      });
      return false;
    }
    
    console.log('Admin account reset successful, result:', data);
    
    // Admin account has been reset, we can now try to sign up with it again
    const adminEmail = 'gitedu@bk.ru';
    const adminPassword = 'Qolej2025*';
    
    // First verify the admin account to ensure it's properly set up
    const { error: verifyError } = await supabase.rpc('verify_designated_admin');
    if (verifyError) {
      console.error('Error verifying admin after reset:', verifyError);
    } else {
      console.log('Admin account verified after reset');
    }
    
    // Then try to sign up with the admin credentials
    const { error: signupError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          name: 'Administrator',
          role: 'admin'
        }
      }
    });
    
    if (signupError) {
      console.error('Error creating admin account after reset:', signupError);
      
      // If it's because the account already exists, that's fine
      if (signupError.message.includes('already registered')) {
        console.log('Admin account already exists, this is expected');
      } else {
        toast.error('Ադմինի հաշվի ստեղծման սխալ', {
          description: signupError.message
        });
        return false;
      }
    }
    
    // Verify the admin account again to ensure it's properly set up
    const { error: finalVerifyError } = await supabase.rpc('verify_designated_admin');
    if (finalVerifyError) {
      console.error('Error verifying admin after signup:', finalVerifyError);
    } else {
      console.log('Admin account successfully verified after signup');
    }
    
    toast.success('Ադմինիստրատորի հաշիվը վերակայվել է', {
      description: 'Այժմ կարող եք մուտք գործել օգտագործելով gitedu@bk.ru և Qolej2025* գաղտնաբառը'
    });
    
    // Sign out current session if any
    await supabase.auth.signOut();
    
    return true;
  } catch (error) {
    console.error('Unexpected error resetting admin account:', error);
    toast.error('Սխալ', {
      description: 'Տեղի ունեցավ անսպասելի սխալ'
    });
    return false;
  }
};
