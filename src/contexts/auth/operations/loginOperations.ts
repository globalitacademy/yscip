
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
      console.log('Admin login attempt detected, resetting admin account first');
      try {
        // Reset admin account to ensure it works correctly
        const { data: resetData, error: resetError } = await supabase.rpc('reset_admin_account');
        
        if (resetError) {
          console.error('Error resetting admin account:', resetError);
        } else {
          console.log('Admin account reset successful');
          
          // Force a small delay to ensure reset is fully processed
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Try to sign in with the default admin password
          const { data, error } = await supabase.auth.signInWithPassword({
            email: 'gitedu@bk.ru',
            password: 'Qolej2025*'
          });
          
          if (error) {
            console.error('Login error after reset:', error);
            toast.error('Ադմինի մուտքը չի հաջողվել', {
              description: 'Տեխնիկական խնդիր, փորձեք կրկին'
            });
            return false;
          }
          
          if (data.session) {
            console.log('Admin login successful after reset');
            toast.success('Մուտքը հաջողվել է', {
              description: 'Դուք մուտք եք գործել որպես ադմինիստրատոր'
            });
            return true;
          }
        }
      } catch (err) {
        console.error('Error in admin reset process:', err);
      }
    }
    
    // Regular login attempt
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
            description: 'Փորձեք օգտագործել ստանդարտ տվյալները՝ gitedu@bk.ru և Qolej2025*'
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

    console.log('Login successful, session established');
    toast.success('Մուտքը հաջողվել է', {
      description: isAdmin ? 'Դուք մուտք եք գործել որպես ադմինիստրատոր' : 'Դուք հաջողությամբ մուտք եք գործել համակարգ'
    });
    return true;
  } catch (error) {
    console.error('Unexpected login error:', error);
    toast.error('Սխալ', {
      description: 'Տեղի ունեցավ անսպասելի սխալ'
    });
    return false;
  }
};
