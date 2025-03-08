
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SupabaseAdminUser } from '@/types/auth';

// Սուպերադմին՝ նախապես սահմանված մուտքի տվյալներով
const SUPER_ADMIN_EMAIL = 'superadmin@npua.am';
const SUPER_ADMIN_PASSWORD = 'SuperAdmin123!';

export const loginAsSuperAdmin = async () => {
  try {
    console.log('Attempting to login as superadmin...');
    // Ուղղակի փորձում ենք մուտք գործել որպես սուպերադմին
    const { data, error } = await supabase.auth.signInWithPassword({
      email: SUPER_ADMIN_EMAIL,
      password: SUPER_ADMIN_PASSWORD
    });
    
    if (error) {
      // Եթե սխալ է՝ ստուգում ենք, արդյոք սխալը նրանում է, որ օգտատեր չկա
      console.log('Superadmin login error:', error.message);
      
      if (error.message.includes('Invalid login credentials') || error.message.includes('Email not confirmed')) {
        console.log('Սուպերադմին օգտատերը չի գտնվել կամ չի հաստատվել: Ստեղծում ենք...');
        // Եթե չկա, ապա ստեղծում ենք
        return await createSuperAdmin();
      }
      
      console.error('Մուտքի սխալ:', error);
      toast.error('Չհաջողվեց մուտք գործել որպես սուպերադմին: ' + error.message);
      return false;
    }
    
    console.log('Հաջողությամբ մուտք գործվեց որպես սուպերադմին');
    toast.success('Հաջողությամբ մուտք գործվեց որպես սուպերադմին');
    return true;
  } catch (error) {
    console.error('Սխալ սուպերադմին մուտքի ժամանակ:', error);
    toast.error('Սխալ սուպերադմին մուտքի ժամանակ: ' + (error as Error).message);
    return false;
  }
};

// Սուպերադմին օգտատեր ստեղծող ֆունկցիա
const createSuperAdmin = async () => {
  try {
    console.log('Creating superadmin account...');
    
    // First check if the superadmin already exists
    const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('Error listing users:', usersError);
      toast.error('Չհաջողվեց ստուգել օգտատերերին: ' + usersError.message);
      return false;
    }
    
    const existingUser = usersData?.users.find(user => user.email === SUPER_ADMIN_EMAIL);
    
    if (existingUser) {
      console.log('Superadmin account already exists, updating...');
      
      // Update the existing user to ensure it has superadmin role and is approved
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        { 
          user_metadata: {
            ...existingUser.user_metadata,
            role: 'superadmin',
            registration_approved: true,
            name: 'Սուպերադմինիստրատոր',
          },
          email_confirm: true
        }
      );
      
      if (updateError) {
        console.error('Error updating superadmin:', updateError);
        toast.error('Չհաջողվեց թարմացնել սուպերադմինին: ' + updateError.message);
        return false;
      }
      
      toast.success('Սուպերադմինը թարմացվել է: Փորձեք նորից մուտք գործել:');
      return true;
    }
    
    // Ստեղծում ենք սուպերադմին օգտատեր
    const { data, error } = await supabase.auth.signUp({
      email: SUPER_ADMIN_EMAIL,
      password: SUPER_ADMIN_PASSWORD,
      options: {
        data: {
          name: 'Սուպերադմինիստրատոր',
          role: 'superadmin',
          registration_approved: true,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=superadmin${Date.now()}`
        }
      }
    });
    
    if (error) {
      console.error('Չհաջողվեց ստեղծել սուպերադմին օգտատեր:', error);
      toast.error('Չհաջողվեց ստեղծել սուպերադմին օգտատեր: ' + error.message);
      return false;
    }
    
    // Automatically confirm the email for superadmin
    if (data?.user?.id) {
      try {
        // This is a bit of a hack, but it works for development
        const { error: confirmError } = await supabase.auth.admin.updateUserById(
          data.user.id,
          { email_confirm: true }
        );
        
        if (confirmError) {
          console.error('Error confirming superadmin email:', confirmError);
        } else {
          console.log('Superadmin email automatically confirmed');
        }
      } catch (confirmError) {
        console.error('Error during email confirmation:', confirmError);
      }
    }
    
    console.log('Սուպերադմին օգտատերը հաջողությամբ ստեղծվել է:', data);
    toast.success('Սուպերադմին օգտատերը հաջողությամբ ստեղծվել է։ Կրկին սեղմեք մուտք գործելու համար։');
    return true;
  } catch (error) {
    console.error('Սխալ սուպերադմին օգտատեր ստեղծելիս:', error);
    toast.error('Սխալ սուպերադմին օգտատեր ստեղծելիս: ' + (error as Error).message);
    return false;
  }
};

// Հեռացնում ենք նախկին ադմին օգտատեր ստեղծող ֆունկցիան
export const createAdminUser = async () => {
  // Հեռացնում ենք հին ադմին ստեղծելու ֆունկցիոնալը և փոխարինում ենք սուպերադմին մուտքի ֆունկցիայով
  return loginAsSuperAdmin();
};
