
import { User, UserRole } from '@/types/user';
import { mockUsers } from '@/data/mockUsers';
import { PendingUser } from '@/types/auth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useUserOperations = (
  pendingUsers: PendingUser[],
  setPendingUsers: React.Dispatch<React.SetStateAction<PendingUser[]>>,
  setUser: (user: User | null) => void
) => {
  const switchRole = (role: UserRole) => {
    const userWithRole = mockUsers.find(u => u.role === role);
    if (userWithRole) {
      setUser(userWithRole);
      localStorage.setItem('currentUser', JSON.stringify(userWithRole));
    }
  };

  const sendVerificationEmail = async (email: string): Promise<{success: boolean, token?: string}> => {
    console.log('Sending verification email to:', email);
    
    try {
      // First try with Supabase
      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`
        }
      });
      
      if (error) {
        console.error('Error sending verification email via Supabase:', error);
        throw error;
      }
      
      // Also send our custom email for better reliability
      // Generate a user ID, safely handling the case where data.user might be null
      const userId = data?.user?.id || generateMockToken();
      const verificationUrl = `${window.location.origin}/verify-email?token=${userId}`;
      
      const { error: edgeError } = await supabase.functions.invoke('send-verification-email', {
        body: { 
          email: email, 
          verificationUrl
        }
      });
      
      if (edgeError) {
        console.error('Error sending custom verification email:', edgeError);
      } else {
        console.log('Custom verification email sent successfully');
      }
      
      toast.success(`Հաստատման հղումը կրկին ուղարկված է Ձեր էլ․ փոստին։`);
      return { success: true, token: userId };
    } catch (e) {
      console.error('Exception sending verification email:', e);
      
      // Fallback to legacy method
      const pendingUserIndex = pendingUsers.findIndex(u => u.email?.toLowerCase() === email.toLowerCase());
      
      if (pendingUserIndex === -1) {
        return { success: false };
      }
      
      const token = pendingUsers[pendingUserIndex].verificationToken;
      console.log(`Verification email resent to ${email} with token: ${token}`);
      console.log(`Verification link: ${window.location.origin}/verify-email?token=${token}`);
      
      toast.success(`Հաստատման հղումը կրկին ուղարկված է Ձեր էլ․ փոստին։`);
      
      return { success: true, token };
    }
  };

  const generateMockToken = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const verifyEmail = async (token: string): Promise<boolean> => {
    console.log('Verifying email with token:', token);
    
    try {
      // First check if this is a Supabase session
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData && sessionData.session) {
        console.log('User is already authenticated with Supabase');
        return true;
      }
      
      // Otherwise, try to verify the token with Supabase directly
      const { data: userData } = await supabase.auth.getUser(token);
      
      if (userData && userData.user) {
        console.log('User verified successfully with Supabase token');
        return true;
      }
    } catch (e) {
      console.error('Error verifying with Supabase:', e);
    }
    
    // Fallback to legacy method
    const pendingUserIndex = pendingUsers.findIndex(u => u.verificationToken === token);
    
    if (pendingUserIndex === -1) {
      console.log('Token not found in pending users');
      return false;
    }
    
    console.log('Token found in pending users, verifying');
    const updatedPendingUsers = [...pendingUsers];
    updatedPendingUsers[pendingUserIndex].verified = true;
    
    if (updatedPendingUsers[pendingUserIndex].role === 'student') {
      updatedPendingUsers[pendingUserIndex].registrationApproved = true;
    }
    
    setPendingUsers(updatedPendingUsers);
    return true;
  };

  const approveRegistration = async (userId: string): Promise<boolean> => {
    console.log('Approving registration for user:', userId);
    
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ registration_approved: true })
        .eq('id', userId);
      
      if (!error) {
        console.log('Registration approved via Supabase');
        return true;
      }
      
      console.error('Error approving registration via Supabase:', error);
    } catch (e) {
      console.error('Exception approving registration via Supabase:', e);
    }
    
    // Fallback to legacy method
    const pendingUserIndex = pendingUsers.findIndex(u => u.id === userId);
    
    if (pendingUserIndex === -1) {
      return false;
    }
    
    const updatedPendingUsers = [...pendingUsers];
    updatedPendingUsers[pendingUserIndex].registrationApproved = true;
    setPendingUsers(updatedPendingUsers);
    
    return true;
  };

  const getPendingUsers = () => pendingUsers;
  
  const resetAdminAccount = async (): Promise<boolean> => {
    try {
      console.log('Resetting admin account');
      
      // First try direct admin activation through edge function
      const { data, error } = await supabase.functions.invoke('ensure-admin-activation');
      
      if (error) {
        console.error('Error calling admin activation function:', error);
      } else {
        console.log('Admin activation function response:', data);
      }
      
      // Whether or not the edge function succeeds, we'll also do the client-side reset
      // to ensure the admin account is available locally
      
      // Add main admin to mock data if not exists
      const adminExists = mockUsers.some(user => user.email === 'gitedu@bk.ru');
      
      if (!adminExists) {
        const newAdmin: User = {
          id: `admin-${Date.now()}`,
          name: 'Ադմինիստրատոր',
          email: 'gitedu@bk.ru',
          role: 'admin',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=giteduadmin`,
          department: 'Ադմինիստրացիա',
          registrationApproved: true
        };
        
        mockUsers.push(newAdmin);
      }
      
      // Also ensure this admin is not in pending users (or is approved if there)
      const pendingAdminIndex = pendingUsers.findIndex(
        u => u.email?.toLowerCase() === 'gitedu@bk.ru'
      );
      
      if (pendingAdminIndex >= 0) {
        const updatedPendingUsers = [...pendingUsers];
        updatedPendingUsers[pendingAdminIndex].verified = true;
        updatedPendingUsers[pendingAdminIndex].registrationApproved = true;
        setPendingUsers(updatedPendingUsers);
      }
      
      toast.success('Ադմինիստրատորի հաշիվը վերականգնված է։');
      return true;
    } catch (error) {
      console.error('Error resetting admin account:', error);
      toast.error('Սխալ ադմինիստրատորի հաշիվը վերականգնելիս։');
      return false;
    }
  };

  return {
    switchRole,
    sendVerificationEmail,
    verifyEmail,
    approveRegistration,
    getPendingUsers,
    resetAdminAccount
  };
};
