
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const resetAdminAccount = async (): Promise<boolean> => {
  try {
    console.log('Resetting admin account');
    
    // First sign out any current session to avoid conflicts
    await supabase.auth.signOut();
    
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
    
    // Ensure admin account is properly set up
    const { error: ensureError } = await supabase.rpc('ensure_admin_login');
    if (ensureError) {
      console.error('Error ensuring admin setup after reset:', ensureError);
    } else {
      console.log('Admin account verification successful after reset');
    }
    
    // Try to sign up with the admin credentials
    const adminEmail = 'gitedu@bk.ru';
    const adminPassword = 'Qolej2025*';
    
    // Try to sign up with the admin credentials
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
      
      // If it's because the account already exists, try to sign in
      if (signupError.message.includes('already registered')) {
        console.log('Admin account already exists, trying to sign in');
        
        // Try signing in with admin credentials
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password: adminPassword
        });
        
        if (signInError) {
          console.error('Error signing in as admin after reset:', signInError);
        } else {
          console.log('Successfully signed in as admin after reset');
          toast.success('Ադմինի մուտքը հաջողվել է', {
            description: 'Դուք մուտք եք գործել որպես ադմինիստրատոր'
          });
        }
      } else {
        toast.error('Ադմինի հաշվի ստեղծման սխալ', {
          description: signupError.message
        });
      }
    }
    
    toast.success('Ադմինիստրատորի հաշիվը վերակայվել է', {
      description: 'Այժմ կարող եք մուտք գործել օգտագործելով gitedu@bk.ru և Qolej2025* գաղտնաբառը'
    });
    
    return true;
  } catch (error) {
    console.error('Unexpected error resetting admin account:', error);
    toast.error('Սխալ', {
      description: 'Տեղի ունեցավ անսպասելի սխալ'
    });
    return false;
  }
};
