
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
        // Remove emailRedirectTo since we'll handle this ourselves
      }
    });
    
    if (error) {
      console.error('Supabase registration error:', error);
      toast.error('Գրանցման ընթացքում սխալ է տեղի ունեցել։ Խնդրում ենք փորձել կրկին։');
      return handleSignUpUser(userData, pendingUsers, setPendingUsers);
    }

    console.log('Registration successful via Supabase:', data);
    
    // Send custom verification email via our edge function
    if (data.user) {
      try {
        // Generate verification URL
        const token = data.user.confirmation_sent_at 
          ? await generateSupabaseVerificationToken(data.user.email || '')
          : null;
          
        if (token) {
          const verificationUrl = `${window.location.origin}/verify-email?token=${token}`;
          
          const emailSent = await sendVerificationEmail({
            email: userData.email || '',
            name: userData.name,
            verificationUrl
          });
          
          if (emailSent) {
            console.log('Custom verification email sent successfully');
          } else {
            console.error('Failed to send custom verification email');
          }
        }
      } catch (emailError) {
        console.error('Error sending verification email:', emailError);
      }
    }
    
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

// Helper function to generate a Supabase verification token
async function generateSupabaseVerificationToken(email: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { 
        captchaToken: undefined
      }
    });
    
    if (error) {
      console.error('Error generating verification token:', error);
      return null;
    }
    
    // For local development, we'll generate a mock token
    // In production, Supabase sends the email with token directly
    const mockToken = `mock-${Math.random().toString(36).substring(2, 15)}`;
    return mockToken;
  } catch (error) {
    console.error('Error in generateVerificationToken:', error);
    return null;
  }
}

// Function to send verification email using our edge function
async function sendVerificationEmail({
  email,
  name,
  verificationUrl
}: {
  email: string;
  name?: string;
  verificationUrl: string;
}): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('send-verification-email', {
      body: { email, name, verificationUrl }
    });
    
    if (error) {
      console.error('Error invoking send-verification-email function:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
}
