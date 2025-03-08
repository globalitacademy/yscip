
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
      
      // Get the current URL for redirects
      const currentOrigin = window.location.origin;
      const redirectUrl = `${currentOrigin}/verify-email`;
      
      console.log('Using redirect URL:', redirectUrl);
      
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
          emailRedirectTo: redirectUrl
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
      
      // User was created but needs email confirmation - attempt magic link login
      if (signUpData) {
        console.log('Սուպերադմին օգտատերը ստեղծվեց, ուղարկում ենք magic link...');
        toast.success('Սուպերադմին հաշիվը ստեղծվել է');
        
        // Try to send a magic link to log in
        const { data: magicLinkData, error: magicLinkError } = await supabase.auth.signInWithOtp({
          email: SUPER_ADMIN_EMAIL,
          options: {
            emailRedirectTo: redirectUrl
          }
        });
        
        if (magicLinkError) {
          console.error('Magic link error:', magicLinkError);
          toast.error('Չհաջողվեց ուղարկել մուտքի հղումը: ' + magicLinkError.message);
        } else {
          toast.success('Մուտքի հղումն ուղարկվել է Ձեր էլ․ հասցեին: Խնդրում ենք ստուգել Ձեր փոստարկղը:');
          console.log('Magic link sent successfully');
        }
        
        // Also try direct sign-in just in case
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
          toast.info('Հաշիվը ստեղծվել է, ստուգեք Ձեր էլ. փոստը մուտքի հղման համար');
          
          // Show manual instructions
          toast.info('Եթե հղումը չի հասնում, խնդրում ենք մուտք գործեք Supabase վահանակ և հաստատեք օգտատիրոջ էլ․ հասցեն');
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
