
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { isDesignatedAdmin } from '../utils';

export const login = async (email: string, password: string): Promise<boolean> => {
  try {
    console.log('Attempting login for:', email);
    
    // Clean up email input
    const cleanEmail = email.trim().toLowerCase();
    
    // Check if this is the designated admin email
    const isAdmin = await isDesignatedAdmin(cleanEmail);
    
    if (isAdmin) {
      console.log('Admin login attempt detected, ensuring account is verified');
      try {
        // Ensure the admin account is properly set up and verified
        const { error: rpcError } = await supabase.rpc('verify_designated_admin');
        
        if (rpcError) {
          console.error('Error verifying admin via RPC:', rpcError);
          toast.error('Ադմինի հաշվի ստուգման սխալ', {
            description: 'Փորձեք վերակայել ադմինի հաշիվը և նորից գրանցվել'
          });
          return false;
        }
        console.log('Admin verification via RPC successful');
      } catch (err) {
        console.error('Error in admin verification process:', err);
        return false;
      }
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password
    });
    
    if (error) {
      console.error('Login error:', error);
      
      if (error.message.includes('Email not confirmed')) {
        toast.error('Էլ․ հասցեն չի հաստատվել', {
          description: 'Խնդրում ենք ստուգել Ձեր էլ․ փոստը հաստատման հղման համար'
        });
      } else if (error.message.includes('Invalid login credentials')) {
        if (isAdmin) {
          toast.error('Ադմինի մուտքը չի հաջողվել', {
            description: 'Փորձեք վերակայել ադմինի հաշիվը և նորից գրանցվել'
          });
        } else {
          toast.error('Սխալ մուտքի տվյալներ', {
            description: 'Խնդրում ենք ստուգել Ձեր էլ․ հասցեն և գաղտնաբառը'
          });
        }
      } else {
        toast.error('Մուտքը չի հաջողվել', {
          description: error.message
        });
      }
      return false;
    }

    if (!data.session) {
      console.error('No session returned after login');
      toast.error('Մուտքը չի հաջողվել', {
        description: 'Տեղի ունեցավ անսպասելի սխալ'
      });
      return false;
    }

    // For admin, double-check and make sure we have a proper user record
    if (isAdmin) {
      console.log('Admin login successful, ensuring proper admin profile');
      try {
        const { error: verifyError } = await supabase.rpc('verify_designated_admin');
        if (verifyError) {
          console.error('Post-login admin verification error:', verifyError);
        }
      } catch (err) {
        console.error('Error in post-login admin verification:', err);
      }
    }

    console.log('Login successful, session established');
    return true;
  } catch (error) {
    console.error('Unexpected login error:', error);
    toast.error('Սխալ', {
      description: 'Տեղի ունեցավ անսպասելի սխալ'
    });
    return false;
  }
};
