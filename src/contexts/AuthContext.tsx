
import React, { createContext, useContext } from 'react';
import { User, UserRole } from '@/types/user';
import { mockUsers } from '@/data/mockUsers';
import { AuthContextType, PendingUser } from '@/types/auth';
import { useAuthSession } from '@/hooks/auth/useAuthSession';
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
    isLoading
  } = useAuthSession();

  // Authentication operations
  const { login, logout, registerUser } = useAuthOperations(
    user, 
    pendingUsers, 
    setUser, 
    setIsAuthenticated, 
    setPendingUsers
  );

  // User management operations
  const { 
    switchRole, 
    sendVerificationEmail, 
    verifyEmail, 
    approveRegistration, 
    getPendingUsers,
    resetAdminAccount 
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
        resetAdminAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
