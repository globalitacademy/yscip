
import { User } from '@/types/user';
import { PendingUser, DemoAccount } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export const useRegistrationOperations = (
  pendingUsers: PendingUser[],
  demoAccounts: DemoAccount[] | undefined,
  setPendingUsers: React.Dispatch<React.SetStateAction<PendingUser[]>>
) => {
  const registerUser = async (userData: Partial<User> & { password: string }): Promise<{success: boolean, token?: string}> => {
    // First try with Supabase
    try {
      // Check if it's a demo account email
      const isDemoAccount = demoAccounts?.some(
        account => account.email.toLowerCase() === userData.email?.toLowerCase()
      );
      
      if (isDemoAccount) {
        toast.error('Այս էլ․ հասցեն արդեն գրանցված է որպես դեմո հաշիվ');
        return { success: false };
      }
      
      // Try to sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: userData.role || 'student'
          }
        }
      });
      
      if (!error && data.user) {
        console.log('Supabase registration successful');
        
        // Note: The user profile will be created through DB trigger
        
        toast.success('Գրանցումը հաջողված է, խնդրում ենք ստուգել Ձեր էլ․ փոստը հաստատման համար');
        return { success: true };
      } else if (error) {
        console.error('Supabase registration error:', error);
        // Now fallback to local registration
      }
    } catch (e) {
      console.error('Exception in Supabase registration:', e);
    }
    
    // Local registration process (fallback)
    const existingPendingUser = pendingUsers.find(
      u => u.email?.toLowerCase() === userData.email?.toLowerCase()
    );
    
    if (existingPendingUser) {
      toast.error('Այս էլ․ հասցեն արդեն գրանցված է');
      return { success: false };
    }
    
    // Generate a verification token
    const verificationToken = uuidv4();
    
    // Create a new pending user
    const newPendingUser: PendingUser = {
      id: uuidv4(),
      name: userData.name,
      email: userData.email,
      role: userData.role || 'student',
      password: userData.password,
      department: userData.department,
      verificationToken,
      verified: false
    };
    
    setPendingUsers(prev => [...prev, newPendingUser]);
    console.log(`Verification token generated for ${userData.email}: ${verificationToken}`);
    console.log(`Verification link: ${window.location.origin}/verify-email?token=${verificationToken}`);
    
    toast.success('Գրանցումը հաջողված է, խնդրում ենք ստուգել Ձեր էլ․ փոստը հաստատման համար');
    return { success: true, token: verificationToken };
  };

  return {
    registerUser
  };
};
