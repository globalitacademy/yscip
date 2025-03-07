import { User, UserRole, mockUsers } from '@/data/userRoles';
import { toast } from 'sonner';
import { PendingUser, DatabaseSyncStatus } from './types';
import { superAdminUser, generateVerificationToken } from './authUtils';

// Mock database sync status (in a real app, this would be stored in a real DB)
let databaseSyncStatus: DatabaseSyncStatus = {
  lastSynced: 0,
  isSuccessful: false
};

export const createAuthService = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>,
  pendingUsers: PendingUser[],
  setPendingUsers: React.Dispatch<React.SetStateAction<PendingUser[]>>
) => {
  const login = async (email: string, password: string): Promise<boolean> => {
    // Special case for superadmin
    if (email === 'superadmin@example.com' && password === 'SuperAdmin123') {
      setUser(superAdminUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(superAdminUser));
      return true;
    }
    
    // First, check real registered users (from pendingUsers that are verified)
    const pendingUser = pendingUsers.find(
      u => u.email?.toLowerCase() === email.toLowerCase() && 
      u.verified && 
      u.password === password
    );

    if (pendingUser && pendingUser.registrationApproved) {
      const newUser: User = {
        id: pendingUser.id || `user-${Date.now()}`,
        name: pendingUser.name || 'User',
        email: pendingUser.email || '',
        role: pendingUser.role as UserRole || 'student',
        registrationApproved: true,
        avatar: pendingUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`
      };
      
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      return true;
    }
    
    // If not found in pendingUsers, check mockUsers for demo accounts
    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser && foundUser.registrationApproved) {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    
    // Check if user exists but is waiting for approval
    const awaitingApprovalUser = pendingUsers.find(u => 
      u.email?.toLowerCase() === email.toLowerCase() && u.verified && !u.registrationApproved
    );
    
    if (awaitingApprovalUser) {
      toast.error(`Ձեր հաշիվը ակտիվացված է, սակայն սպասում է ադմինիստրատորի հաստատման։`);
      return false;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const registerUser = async (userData: Partial<User> & { password?: string }): Promise<{success: boolean, token?: string}> => {
    try {
      // Check if email already exists in mockUsers
      const emailExists = mockUsers.some(user => user.email.toLowerCase() === userData.email?.toLowerCase());
      if (emailExists) {
        toast.error(`Այս էլ․ հասցեն արդեն գրանցված է։`);
        return { success: false };
      }
      
      // Check if email already exists in pendingUsers
      const pendingEmailExists = pendingUsers.some(user => user.email?.toLowerCase() === userData.email?.toLowerCase());
      if (pendingEmailExists) {
        toast.error(`Այս էլ․ հասցեով գրանցումն արդեն սպասման մեջ է։ Խնդրում ենք ստուգել Ձեր էլ․ փոստը։`);
        return { success: false };
      }
      
      const verificationToken = generateVerificationToken();
      const password = userData.password; // Store password temporarily
      delete userData.password; // Remove password from userData to not store it directly
      
      const newPendingUser: PendingUser = {
        ...userData,
        id: `user-${Date.now()}`,
        verificationToken,
        verified: false,
        registrationApproved: userData.role === 'student', // Students are auto-approved
        password, // Store password for later login
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`
      };
      
      setPendingUsers(prev => [...prev, newPendingUser]);
      
      console.log(`Verification email sent to ${userData.email} with token: ${verificationToken}`);
      console.log(`Verification link: http://localhost:3000/verify-email?token=${verificationToken}`);
      
      const needsApproval = ['lecturer', 'employer', 'project_manager', 'supervisor'].includes(userData.role as string);
      
      toast.success(
        `Գրանցման հայտն ընդունված է։ Խնդրում ենք ստուգել Ձեր էլ․ փոստը՝ հաշիվը ակտիվացնելու համար։${
          needsApproval ? ' Ակտիվացումից հետո Ձեր հաշիվը պետք է հաստատվի ադմինիստրատորի կողմից։' : ''
        }`
      );
      
      return { success: true, token: verificationToken };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false };
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
    
    // Update the pending user as verified
    const updatedPendingUsers = [...pendingUsers];
    updatedPendingUsers[pendingUserIndex].verified = true;
    setPendingUsers(updatedPendingUsers);
    
    // For students, auto-approve and add to real accounts
    if (updatedPendingUsers[pendingUserIndex].role === 'student') {
      updatedPendingUsers[pendingUserIndex].registrationApproved = true;
    }
    
    return true;
  };

  const approveRegistration = async (userId: string): Promise<boolean> => {
    const pendingUserIndex = pendingUsers.findIndex(u => u.id === userId);
    
    if (pendingUserIndex === -1) {
      return false;
    }
    
    // Approve the registration
    const updatedPendingUsers = [...pendingUsers];
    updatedPendingUsers[pendingUserIndex].registrationApproved = true;
    setPendingUsers(updatedPendingUsers);
    
    return true;
  };

  const getPendingUsers = () => {
    return pendingUsers;
  };

  // New function to synchronize roles with database
  const syncRolesWithDatabase = async (): Promise<boolean> => {
    try {
      console.log('Starting database synchronization...');
      
      // Simulate API call to database
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, we would fetch data from the database and update our local state
      // For this mock implementation, we're just updating the sync status
      databaseSyncStatus = {
        lastSynced: Date.now(),
        isSuccessful: true
      };
      
      console.log('Database synchronization completed successfully');
      
      // Save the current state to local storage (simulating a database)
      localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
      localStorage.setItem('pendingUsers', JSON.stringify(pendingUsers));
      localStorage.setItem('databaseSyncStatus', JSON.stringify(databaseSyncStatus));
      
      return true;
    } catch (error) {
      console.error('Database synchronization failed:', error);
      
      databaseSyncStatus = {
        lastSynced: Date.now(),
        isSuccessful: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      };
      
      return false;
    }
  };

  // New function to reset all roles and settings
  const resetRolesAndSettings = async (): Promise<boolean> => {
    try {
      console.log('Starting system reset...');
      
      // Clear all users except superadmin
      mockUsers.length = 0;
      mockUsers.push(superAdminUser);
      
      // Clear all pending users
      setPendingUsers([]);
      
      // Reset sync status
      databaseSyncStatus = {
        lastSynced: Date.now(),
        isSuccessful: true
      };
      
      // Save the reset state to local storage
      localStorage.removeItem('mockUsers');
      localStorage.removeItem('pendingUsers');
      localStorage.setItem('databaseSyncStatus', JSON.stringify(databaseSyncStatus));
      
      console.log('System reset completed successfully');
      
      // Log out current user if not superadmin
      if (setUser && setIsAuthenticated) {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
          const user = JSON.parse(currentUser);
          if (user.email !== superAdminUser.email) {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('currentUser');
          }
        }
      }
      
      return true;
    } catch (error) {
      console.error('System reset failed:', error);
      
      databaseSyncStatus = {
        lastSynced: Date.now(),
        isSuccessful: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error during reset'
      };
      
      return false;
    }
  };

  return {
    login,
    logout,
    registerUser,
    sendVerificationEmail,
    verifyEmail,
    approveRegistration,
    getPendingUsers,
    syncRolesWithDatabase,
    resetRolesAndSettings
  };
};
