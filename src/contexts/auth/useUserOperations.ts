
import { User, UserRole } from '@/types/user';
import { mockUsers } from '@/data/mockUsers';
import { PendingUser } from '@/types/auth';
import { toast } from 'sonner';
import { SupabaseClient } from '@supabase/supabase-js';

export const useUserOperations = (
  pendingUsers: PendingUser[],
  setPendingUsers: React.Dispatch<React.SetStateAction<PendingUser[]>>,
  supabase: SupabaseClient
) => {
  const switchRole = async (role: UserRole) => {
    // This function is for demo purposes only
    const userWithRole = mockUsers.find(u => u.role === role);
    if (userWithRole) {
      // First sign out current user
      await supabase.auth.signOut();
      
      // Temporarily store the mock user in localStorage
      localStorage.setItem('currentUser', JSON.stringify(userWithRole));
      
      // Reload page to apply the change
      window.location.reload();
    }
  };

  const sendVerificationEmail = async (email: string): Promise<{success: boolean, token?: string}> => {
    console.log('Sending verification email to:', email);
    
    // First try with Supabase
    try {
      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`
        }
      });
      
      if (!error) {
        console.log('Verification email sent via Supabase');
        toast.success(`Հաստատման հղումը կրկին ուղարկված է Ձեր էլ․ փոստին։`);
        return { success: true };
      }
      
      console.error('Error sending verification email via Supabase:', error);
    } catch (e) {
      console.error('Exception sending verification email via Supabase:', e);
    }
    
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
  };

  const verifyEmail = async (token: string): Promise<boolean> => {
    console.log('Verifying email with token:', token);
    
    // Try with Supabase first
    try {
      // Check if this is a Supabase token
      if (token.includes('.')) {
        console.log('Appears to be a Supabase token, verifying');
        return true; // The email gets verified automatically by Supabase when they click the link
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
    
    // Try with Supabase first
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

  const getPendingUsers = async () => {
    // Try to get pending users from Supabase first
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('registration_approved', false);
        
      if (!error && data) {
        // Map to PendingUser format
        return data.map(user => ({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as UserRole,
          verified: true, // If it's in the database, it's verified
          registrationApproved: user.registration_approved,
          avatar: user.avatar
        }));
      }
    } catch (e) {
      console.error('Error fetching pending users from Supabase:', e);
    }
    
    // Fallback to local storage
    return pendingUsers;
  };
  
  const resetAdminAccount = async (): Promise<boolean> => {
    try {
      console.log('Resetting admin account');
      
      // Call admin activation through edge function
      const { data, error } = await supabase.functions.invoke('ensure-admin-activation');
      
      if (error) {
        console.error('Error calling admin activation function:', error);
        toast.error('Սխալ ադմինիստրատորի հաշիվը վերականգնելիս։');
        return false;
      }
      
      console.log('Admin activation function response:', data);
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
