
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Սուպերադմին՝ նախապես սահմանված մուտքի տվյալներով
const SUPER_ADMIN_EMAIL = 'gitedu@bk.ru';
const SUPER_ADMIN_PASSWORD = 'Gev2025*';

export const loginAsSuperAdmin = async () => {
  try {
    console.log('Attempting to login as superadmin...');
    
    // First check if superadmin exists by trying to sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: SUPER_ADMIN_EMAIL,
      password: SUPER_ADMIN_PASSWORD
    });
    
    // If login success, return true
    if (signInData?.user) {
      console.log('Հաջողությամբ մուտք գործվեց որպես սուպերադմին');
      toast.success('Հաջողությամբ մուտք գործվեց որպես սուպերադմին');
      return true;
    }
    
    // If login error due to invalid credentials or unconfirmed email, create the account
    if (signInError) {
      console.log('Superadmin login error:', signInError.message);
      
      // Try to sign up (create) the superadmin user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: SUPER_ADMIN_EMAIL,
        password: SUPER_ADMIN_PASSWORD,
        options: {
          data: {
            name: 'Սուպերադմինիստրատոր',
            role: 'superadmin',
            registration_approved: true,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=superadmin${Date.now()}`
          },
          // Skip email confirmation for superadmin account by setting emailRedirectTo to current URL
          emailRedirectTo: `${window.location.origin}/login`,
          // Setting autoconfirm to true (not supported directly by Supabase JS client)
          // Instead, we'll suggest an admin panel operation after this
        }
      });
      
      if (signUpError) {
        // If rate limited, don't show as error but suggest waiting
        if (signUpError.message.includes('security purposes') && signUpError.message.includes('seconds')) {
          console.log('Rate limit error:', signUpError.message);
          toast.warning('Խնդրում ենք սպասել մի քանի վայրկյան եւ փորձել կրկին։ ' + signUpError.message);
          return false;
        }
        
        // Other signup errors
        console.error('Չհաջողվեց ստեղծել սուպերադմին օգտատեր:', signUpError);
        toast.error('Չհաջողվեց ստեղծել սուպերադմին օգտատեր: ' + signUpError.message);
        return false;
      }
      
      // User was created but needs email confirmation - attempt direct sign-in anyway
      if (signUpData) {
        console.log('Սուպերադմին օգտատերը ստեղծվեց, փորձում ենք ավտոմատ մուտք գործել');
        toast.success('Սուպերադմին հաշիվը ստեղծվել է');
        
        // Attempt to sign in directly despite the email not being confirmed
        // This won't work typically but we try it anyway
        const { data: forceSignInData, error: forceSignInError } = await supabase.auth.signInWithPassword({
          email: SUPER_ADMIN_EMAIL,
          password: SUPER_ADMIN_PASSWORD
        });
        
        if (forceSignInData?.user) {
          console.log('Հաջողվեց ավտոմատ մուտք գործել որպես սուպերադմին');
          toast.success('Հաջողությամբ մուտք գործվեց որպես սուպերադմին');
          return true;
        } else {
          console.log('Ավտոմատ մուտքը չհաջողվեց:', forceSignInError?.message);
          toast.info('Հաշիվը ստեղծվել է, բայց էլ. հասցեն պետք է հաստատվի Supabase վահանակում ադմինիստրատորի կողմից');
          return false;
        }
      }
    }
    
    return false;
  } catch (error) {
    console.error('Սխալ սուպերադմին մուտքի ժամանակ:', error);
    toast.error('Սխալ սուպերադմին մուտքի ժամանակ: ' + (error as Error).message);
    return false;
  }
};

// Հեռացնում ենք նախկին ադմին օգտատեր ստեղծող ֆունկցիան
export const createAdminUser = async () => {
  // Հեռացնում ենք հին ադմին ստեղծելու ֆունկցիոնալը և փոխարինում ենք սուպերադմին մուտքի ֆունկցիայով
  return loginAsSuperAdmin();
};
