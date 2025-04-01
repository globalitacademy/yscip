
import { User } from '@/types/user';
import { PendingUser } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { handleSignUpUser } from '@/utils/authUtils';

export const executeRegistration = async (
  userData: Partial<User> & { password: string },
  pendingUsers: PendingUser[],
  mockUsers: User[],
  setPendingUsers: React.Dispatch<React.SetStateAction<PendingUser[]>>
): Promise<{success: boolean, token?: string}> => {
  try {
    console.log('Registering new user:', userData.email, userData.role);
    
    const emailExists = mockUsers.some(user => user.email.toLowerCase() === userData.email?.toLowerCase());
    if (emailExists) {
      toast.error('Այս էլ․ հասցեն արդեն գրանցված է։');
      return { success: false };
    }
    
    const pendingEmailExists = pendingUsers.some(user => user.email?.toLowerCase() === userData.email?.toLowerCase());
    if (pendingEmailExists) {
      toast.error('Այս էլ․ հասցեով գրանցումն արդեն սպասման մեջ է։ Խնդրում ենք ստուգել Ձեր էլ․ փոստը։');
      return { success: false };
    }

    // Try Supabase registration first
    const { data, error } = await supabase.auth.signUp({
      email: userData.email || '',
      password: userData.password,
      options: {
        data: {
          name: userData.name,
          role: userData.role,
          organization: userData.organization
        },
        emailRedirectTo: `${window.location.origin}/verify-email`
      }
    });
    
    if (error) {
      console.error('Supabase registration error:', error);
      toast.error('Գրանցման ընթացքում սխալ է տեղի ունեցել։ Խնդրում ենք փորձել կրկին։');
      return handleSignUpUser(userData, pendingUsers, setPendingUsers);
    }

    console.log('Registration successful via Supabase:', data);
    
    // Success message based on role
    toast.success(
      `Գրանցման հայտն ընդունված է։ Խնդրում ենք ստուգել Ձեր էլ․ փոստը՝ հաշիվը ակտիվացնելու համար։${
        userData.role !== 'student' ? ' Ակտիվացումից հետո Ձեր հաշիվը պետք է հաստատվի ադմինիստրատորի կողմից։' : ''
      }`
    );

    return { success: true, token: data?.user?.confirmation_sent_at ? 'sent' : undefined };
  } catch (error) {
    console.error('Registration error:', error);
    toast.error('Գրանցման ընթացքում սխալ է տեղի ունեցել։ Խնդրում ենք փորձել կրկին։');
    return { success: false };
  }
};
