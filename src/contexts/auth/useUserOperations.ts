
import { User, UserRole, mockUsers } from '@/data/userRoles';
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
    const pendingUserIndex = pendingUsers.findIndex(u => u.email?.toLowerCase() === email.toLowerCase());
    
    if (pendingUserIndex === -1) {
      return { success: false };
    }
    
    const token = pendingUsers[pendingUserIndex].verificationToken;
    console.log(`Verification email resent to ${email} with token: ${token}`);
    console.log(`Verification link: http://localhost:3000/verify-email?token=${token}`);
    
    toast.success(`Հաստատման հղումը կրկին ուղարկված է Ձեր էլ․ փոստին։`);
    
    return { success: true, token };
  };

  const verifyEmail = async (token: string): Promise<boolean> => {
    const pendingUserIndex = pendingUsers.findIndex(u => u.verificationToken === token);
    
    if (pendingUserIndex === -1) {
      return false;
    }
    
    const updatedPendingUsers = [...pendingUsers];
    updatedPendingUsers[pendingUserIndex].verified = true;
    
    if (updatedPendingUsers[pendingUserIndex].role === 'student') {
      updatedPendingUsers[pendingUserIndex].registrationApproved = true;
    }
    
    setPendingUsers(updatedPendingUsers);
    return true;
  };

  const approveRegistration = async (userId: string): Promise<boolean> => {
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
      // First try with Supabase
      const { data, error } = await supabase.rpc('reset_admin_account');
      
      if (error) {
        console.error('Error resetting admin account:', error);
        
        // Add fallback for when RPC fails
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
      }
      
      toast.success('Ադմինիստրատորի հաշիվը վերականգնված է։');
      return true;
    } catch (error) {
      console.error('Error resetting admin account:', error);
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
