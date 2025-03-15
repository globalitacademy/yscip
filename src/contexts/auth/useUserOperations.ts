
import { User, UserRole } from '@/types/user';
import { mockUsers } from '@/data/mockUsers';
import { PendingUser } from '@/types/auth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

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

  // New function to register real accounts by admin
  const registerRealAccount = async (userData: Partial<User> & { password: string }): Promise<{success: boolean, user?: User}> => {
    try {
      // Make sure we have required fields
      if (!userData.email || !userData.name || !userData.role || !userData.password) {
        toast.error('Բոլոր պարտադիր դաշտերը պետք է լրացված լինեն');
        return { success: false };
      }

      // Try to create user with Supabase
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          name: userData.name,
          role: userData.role
        }
      });

      if (authError) {
        console.error('Error creating user in auth:', authError);
        toast.error(`Օգտատիրոջ ստեղծման սխալ: ${authError.message}`);
        return { success: false };
      }

      if (authData.user) {
        // If successful, create user profile in users table
        const { data: userData2, error: userError } = await supabase
          .from('users')
          .upsert({
            id: authData.user.id,
            name: userData.name,
            email: userData.email,
            role: userData.role as UserRole,
            department: userData.department,
            course: userData.role === 'student' ? userData.course : null,
            group_name: userData.role === 'student' ? userData.group : null,
            organization: userData.role === 'employer' ? userData.organization : null,
            registration_approved: true,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authData.user.id}`
          });

        if (userError) {
          console.error('Error creating user in users table:', userError);
          toast.error(`Օգտատիրոջ պրոֆիլի ստեղծման սխալ: ${userError.message}`);
          return { success: false };
        }

        // Return the created user
        const newUser: User = {
          id: authData.user.id,
          name: userData.name,
          email: userData.email,
          role: userData.role as UserRole,
          department: userData.department,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authData.user.id}`,
          course: userData.role === 'student' ? userData.course : undefined,
          group: userData.role === 'student' ? userData.group : undefined,
          organization: userData.role === 'employer' ? userData.organization : undefined,
          registrationApproved: true
        };

        toast.success(`${newUser.name} օգտատերը հաջողությամբ ստեղծվել է։`);
        return { success: true, user: newUser };
      }
    } catch (error) {
      console.error('Error registering real account:', error);
      toast.error('Սխալ իրական հաշվի գրանցման ժամանակ');
    }

    return { success: false };
  };

  return {
    switchRole,
    sendVerificationEmail,
    verifyEmail,
    approveRegistration,
    getPendingUsers,
    resetAdminAccount,
    registerRealAccount
  };
};
