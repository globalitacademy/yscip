
import React, { createContext, useContext } from 'react';
import { AuthContextType } from './auth/types';
import { initializeMockUsers } from './auth/authUtils';
import { useAuthState } from './auth/useAuthState';
import { createAuthService } from './auth/authService';

// Initialize mock users
initializeMockUsers();

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use our custom hook to manage auth state
  const { user, setUser, isAuthenticated, setIsAuthenticated, pendingUsers, setPendingUsers } = useAuthState();
  
  // Create auth service with functions for auth operations
  const authService = createAuthService(
    setUser,
    setIsAuthenticated,
    pendingUsers,
    setPendingUsers
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        ...authService
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
