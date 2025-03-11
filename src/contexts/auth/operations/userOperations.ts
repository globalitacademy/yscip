
import { supabase } from '@/integrations/supabase/client';
import { DBUser } from '@/types/database.types';
import { toast } from 'sonner';
import { checkExistingEmail, checkFirstAdmin } from '../utils/sessionHelpers';

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

    // If this is the first admin, automatically approve them
    if (isFirstAdmin) {
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
    }
    
    const needsApproval = ['lecturer', 'employer', 'project_manager', 'supervisor', 'admin'].includes(userData.role as string);
    
    toast.success(
      `Գրանցման հայտն ընդունված է։ Խնդրում ենք ստուգել Ձեր էլ․ փոստը՝ հաշիվը ակտիվացնելու համար։${
        needsApproval && !isFirstAdmin ? ' Ակտիվացումից հետո Ձեր հաշիվը պետք է հաստատվի ադմինիստրատորի կողմից։' : ''
      }`
    );
    
    return true;
  } catch (error) {
    console.error('Unexpected registration error:', error);
    toast.error('Տեղի ունեցավ անսպասելի սխալ');
    return false;
  }
};
