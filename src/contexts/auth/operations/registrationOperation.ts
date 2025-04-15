
import { User } from '@/types/user';
import { PendingUser } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { handleSignUpUser } from '@/utils/authUtils';
import { sendVerificationEmailToUser } from '@/utils/authVerificationUtils';

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
          organization: userData.organization,
          department: userData.department,
          specialization: userData.specialization,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`
        },
        emailRedirectTo: `${window.location.origin}/verify-email`
      }
    });
    
    if (error) {
      console.error('Supabase registration error:', error);
      toast.error('Գրանցման ընթացքում սխալ է տեղի ունեցել։ Խնդրում ենք փորձել կրկին։');
      // Fall back to mock user creation
      return handleSignUpUser(userData, pendingUsers, setPendingUsers);
    }

    console.log('Registration successful via Supabase:', data);
    
    // Send custom verification email via our edge function
    if (data.user) {
      try {
        // Generate verification URL using Supabase's token
        const verificationUrl = `${window.location.origin}/verify-email?token=${data.user.id}`;
        
        // Send verification email using our edge function
        const { error: emailError } = await supabase.functions.invoke('send-verification-email', {
          body: { 
            email: userData.email,
            name: userData.name,
            verificationUrl
          }
        });
        
        if (emailError) {
          console.error('Error sending verification email:', emailError);
          // Try to send via utility function as fallback
          await sendVerificationEmailToUser(userData.email || '', data.user.id);
        } else {
          console.log('Custom verification email sent successfully');
        }
      } catch (emailError) {
        console.error('Error sending verification email:', emailError);
      }
    }
    
    // Add user to pending users for local state tracking
    const verificationToken = data?.user?.id || generateVerificationToken();
    const newPendingUser: PendingUser = {
      ...userData,
      id: data?.user?.id || `user-${Date.now()}`,
      verificationToken,
      verified: false,
      registrationApproved: userData.role === 'student',
      password: userData.password,
    };
    
    setPendingUsers(prev => [...prev, newPendingUser]);
    
    // Success message based on role
    toast.success(
      `Գրանցման հայտն ընդունված է։ Խնդրում ենք ստուգել Ձեր էլ․ փոստը՝ հաշիվը ակտիվացնելու համար։${
        userData.role !== 'student' ? ' Ակտիվացումից հետո Ձեր հաշիվը պետք է հաստատվի ադմինիստրատորի կողմից։' : ''
      }`
    );

    return { success: true, token: verificationToken };
  } catch (error) {
    console.error('Registration error:', error);
    toast.error('Գրանցման ընթացքում սխալ է տեղի ունեցել։ Խնդրում ենք փորձել կրկին։');
    return { success: false };
  }
};

const generateVerificationToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
