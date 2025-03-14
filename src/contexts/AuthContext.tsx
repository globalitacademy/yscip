
import React, { createContext, useContext } from 'react';
import { User, UserRole } from '@/types/user';
import { mockUsers } from '@/data/mockUsers';
import { AuthContextType, PendingUser } from '@/types/auth';
import { ensureAdminUsersExist } from './auth/mockAdminUsers';
import { useAuthOperations } from './auth/useAuthOperations';
import { useUserOperations } from './auth/useUserOperations';
import { useRealTimeSession } from '@/hooks/useRealTimeSession';
import { supabase } from '@/integrations/supabase/client';

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
  const { user, isLoading } = useRealTimeSession();
  const isAuthenticated = !!user;

  // Get pending users from API or fall back to local storage
  const [pendingUsers, setPendingUsers] = React.useState<PendingUser[]>(() => {
    const storedPendingUsers = localStorage.getItem('pendingUsers');
    return storedPendingUsers ? JSON.parse(storedPendingUsers) : [];
  });

  // Update localStorage when pendingUsers changes
  React.useEffect(() => {
    if (pendingUsers.length > 0) {
      localStorage.setItem('pendingUsers', JSON.stringify(pendingUsers));
    }
  }, [pendingUsers]);

  // Authentication operations
  const { login, logout, registerUser } = useAuthOperations(
    user, 
    pendingUsers, 
    setPendingUsers,
    supabase
  );

  // User management operations
  const { 
    switchRole, 
    sendVerificationEmail, 
    verifyEmail, 
    approveRegistration, 
    getPendingUsers,
    resetAdminAccount 
  } = useUserOperations(pendingUsers, setPendingUsers, supabase);

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
        // Modify this to match the required synchronous return type
        getPendingUsers: () => pendingUsers,
        resetAdminAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
