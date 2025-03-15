
import React, { createContext, useContext } from 'react';
import { User, UserRole } from '@/types/user';
import { mockUsers } from '@/data/mockUsers';
import { AuthContextType, PendingUser } from '@/types/auth';
import { useAuthSession } from '@/hooks/useAuthSession';
import { ensureAdminUsersExist } from './auth/mockAdminUsers';
import { useAuthOperations } from './auth/useAuthOperations';
import { useUserOperations } from './auth/useUserOperations';

// Ensure admin users exist in mockUsers
const updatedMockUsers = ensureAdminUsersExist(mockUsers);

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    user, 
    isAuthenticated, 
    pendingUsers, 
    setUser, 
    setIsAuthenticated, 
    setPendingUsers,
    isLoading,
    demoAccounts,
    setDemoAccounts
  } = useAuthSession();

  // Authentication operations
  const { 
    login, 
    logout, 
    registerUser, 
    manageDemoAccount 
  } = useAuthOperations(
    user, 
    pendingUsers, 
    demoAccounts,
    setUser, 
    setIsAuthenticated, 
    setPendingUsers,
    setDemoAccounts
  );

  // User management operations
  const { 
    switchRole, 
    sendVerificationEmail, 
    verifyEmail, 
    approveRegistration, 
    getPendingUsers,
    resetAdminAccount,
    registerRealAccount
  } = useUserOperations(pendingUsers, setPendingUsers, setUser);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        switchRole,
        registerUser,
        sendVerificationEmail,
        verifyEmail,
        approveRegistration,
        getPendingUsers,
        resetAdminAccount,
        demoAccounts,
        manageDemoAccount,
        registerRealAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
