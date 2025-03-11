
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { isDesignatedAdmin } from '../utils';

export const login = async (email: string, password: string): Promise<boolean> => {
  try {
    console.log('Attempting login for:', email);
    
    // Check if this is the designated admin email
    const isAdmin = await isDesignatedAdmin(email);
    
    if (isAdmin) {
      console.log('Admin login attempt detected, ensuring account is verified');
      
      try {
        // Call the RPC function to verify the admin before login
        const { error: rpcError } = await supabase.rpc('verify_designated_admin');
        if (rpcError) {
          console.error('Error verifying admin via RPC:', rpcError);
          toast.error('Ադմինի հաշվի ստուգման սխալ', {
            description: 'Փորձեք վերակայել ադմինի հաշիվը և նորից գրանցվել'
          });
          return false;
        } else {
          console.log('Admin verification via RPC successful');
        }
      } catch (err) {
        console.error('Error in admin verification process:', err);
        toast.error('Ադմինի հաշվի ստուգման սխալ', {
          description: 'Փորձեք վերակայել ադմինի հաշիվը և նորից գրանցվել'
        });
        return false;
      }
    }
    
    // Proceed with login
    console.log('Signing in with email and password...');
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
