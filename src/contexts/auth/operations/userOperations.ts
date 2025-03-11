import { supabase } from '@/integrations/supabase/client';
import { DBUser } from '@/types/database.types';
import { toast } from 'sonner';
import { checkExistingEmail, checkFirstAdmin, approveFirstAdmin, isDesignatedAdmin, verifyDesignatedAdmin } from '../utils/sessionHelpers';

export const registerUser = async (userData: Partial<DBUser> & { password: string }): Promise<boolean> => {
  try {
    // Check if email already exists
    const emailExists = await checkExistingEmail(userData.email!);
    
    if (emailExists) {
      // Special case for designated admin
      if (await isDesignatedAdmin(userData.email!)) {
        toast.info(`Այս էլ․ հասցեն արդեն գրանցված է որպես ադմինիստրատոր։ Կարող եք մուտք գործել Ձեր գաղտնաբառով կամ օգտագործել գաղտնաբառի վերականգնման հնարավորությունը։`);
        return false;
      }
      toast.error(`Այս էլ․ հասցեն արդեն գրանցված է։`);
      return false;
    }

    // Check if this is the designated admin email
    const isSpecificAdmin = await isDesignatedAdmin(userData.email!);
    console.log('Is designated admin check result:', isSpecificAdmin);
    
    // Check if this is the first admin account (if not the designated admin)
    let isFirstAdmin = false;
    if (userData.role === 'admin' && !isSpecificAdmin) {
      isFirstAdmin = await checkFirstAdmin();
      console.log('Is first admin check result:', isFirstAdmin);
    }
    
    // Register with Supabase auth
    const { data, error } = await supabase.auth.signUp({
      email: userData.email!,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
          role: isSpecificAdmin ? 'admin' : userData.role,
          email_confirmed: isSpecificAdmin ? true : undefined
        },
        // Skip email verification for designated admin
        emailRedirectTo: isSpecificAdmin 
          ? `${window.location.origin}/verify-email?email=${userData.email}` 
          : `${window.location.origin}/verify-email`
      }
    });
    
    if (error) {
      console.error('Registration error:', error);
      toast.error('Գրանցումը չի հաջողվել: ' + error.message);
      return false;
    }

    // If this is the designated admin, ensure they are automatically approved
    if (isSpecificAdmin) {
      console.log('Registering designated admin:', userData.email);
      await verifyDesignatedAdmin(userData.email!);
      
      // Try logging in the admin user directly
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: userData.email!,
        password: userData.password
      });
      
      if (loginError) {
        console.error('Error auto-logging in admin:', loginError);
      } else {
        console.log('Admin auto login successful');
      }
      
      toast.success('Դուք գրանցվել եք որպես ադմինիստրատոր և ձեր հաշիվը ավտոմատ հաստատվել է։ Կարող եք անմիջապես մուտք գործել համակարգ։');
      return true;
    }

    // If this is the first admin, automatically approve them using our secure function
    if (isFirstAdmin) {
      console.log('Approving first admin:', userData.email);
      const approved = await approveFirstAdmin(userData.email!);
      
      if (!approved) {
        console.error('Error approving first admin through function');
        // Fallback to direct update if function fails
        const { error: updateError } = await supabase
          .from('users')
          .update({ registration_approved: true })
          .eq('email', userData.email!);
        
        if (updateError) {
          console.error('Error approving first admin:', updateError);
        } else {
          toast.success('Դուք գրանցվել եք որպես առաջին ադմինիստրատոր և ձեր հաշիվը ավտոմատ հաստատվել է։');
          return true;
        }
      } else {
        console.log('First admin approved successfully');
        toast.success('Դուք գրանցվել եք որպես առաջին ադմինիստրատոր և ձեր հաշիվը ավտոմատ հաստատվել է։');
        return true;
      }
    }
    
    // Students are auto-approved, other roles need admin approval
    const isStudent = userData.role === 'student';
    const needsApproval = !isStudent && !isFirstAdmin && !isSpecificAdmin;
    
    toast.success(
      `Գրանցման հայտն ընդունված է։ Խնդրում ենք ստուգել Ձեր էլ․ փոստը՝ հաշիվը ակտիվացնելու համար։${
        needsApproval ? ' Ակտիվացումից հետո Ձեր հաշիվը պետք է հաստատվի ադմինիստրատորի կողմից։' : ''
      }`
    );
    
    return true;
  } catch (error) {
    console.error('Unexpected registration error:', error);
    toast.error('Տեղի ունեցավ անսպասելի սխալ');
    return false;
  }
};

// Get user by ID
export const getUserById = async (userId: string): Promise<DBUser | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user by ID:', error);
      return null;
    }
    
    return data as DBUser;
  } catch (error) {
    console.error('Unexpected error fetching user by ID:', error);
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (userId: string, updates: Partial<DBUser>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating user profile:', error);
      toast.error('Պրոֆիլի թարմացման սխալ');
      return false;
    }
    
    toast.success('Պրոֆիլը հաջողությամբ թարմացվել է');
    return true;
  } catch (error) {
    console.error('Unexpected error updating user profile:', error);
    toast.error('Անսպասելի սխալ պրոֆիլի թարմացման ժամանակ');
    return false;
  }
};
