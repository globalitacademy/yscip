
import { supabase } from '@/integrations/supabase/client';
import { DBUser } from '@/types/database.types';
import { toast } from 'sonner';
import { checkExistingEmail, checkFirstAdmin, approveFirstAdmin } from '../utils/sessionHelpers';

export const registerUser = async (userData: Partial<DBUser> & { password: string }): Promise<boolean> => {
  try {
    // Check if email already exists
    const emailExists = await checkExistingEmail(userData.email!);
    
    if (emailExists) {
      toast.error(`Այս էլ․ հասցեն արդեն գրանցված է։`);
      return false;
    }

    // Check if this is the first admin account
    let isFirstAdmin = false;
    if (userData.role === 'admin') {
      isFirstAdmin = await checkFirstAdmin();
    }
    
    // Register with Supabase auth
    const { data, error } = await supabase.auth.signUp({
      email: userData.email!,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
          role: userData.role
        }
      }
    });
    
    if (error) {
      console.error('Registration error:', error);
      toast.error('Գրանցումը չի հաջողվել: ' + error.message);
      return false;
    }

    // If this is the first admin, automatically approve them using our secure function
    if (isFirstAdmin) {
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
        toast.success('Դուք գրանցվել եք որպես առաջին ադմինիստրատոր և ձեր հաշիվը ավտոմատ հաստատվել է։');
        return true;
      }
    }
    
    // Students are auto-approved, other roles need admin approval
    const isStudent = userData.role === 'student';
    const needsApproval = !isStudent && !isFirstAdmin;
    
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
