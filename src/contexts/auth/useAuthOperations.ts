
import { useState } from 'react';
import { User, UserRole } from '@/types/user';
import { mockUsers } from '@/data/mockUsers';
import { PendingUser } from '@/types/auth';
import { executeLogin } from './operations/loginOperation';
import { executeRegistration } from './operations/registrationOperation';
import { executeLogout } from './operations/logoutOperation';

export const useAuthOperations = (
  user: User | null,
  pendingUsers: PendingUser[],
  setUser: (user: User | null) => void,
  setIsAuthenticated: (value: boolean) => void,
  setPendingUsers: React.Dispatch<React.SetStateAction<PendingUser[]>>
) => {
  const [loginAttempts, setLoginAttempts] = useState(0);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoginAttempts(prev => prev + 1);
    return executeLogin(email, password, pendingUsers, mockUsers, setUser, setIsAuthenticated);
  };

  const registerUser = async (userData: Partial<User> & { password: string }): Promise<{success: boolean, token?: string}> => {
    return executeRegistration(userData, pendingUsers, mockUsers, setPendingUsers);
  };

  const logout = async () => {
    await executeLogout(setUser, setIsAuthenticated);
  };

  return {
    login,
    logout,
    registerUser,
  };
};
