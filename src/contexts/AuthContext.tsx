
import React, { createContext, useContext } from 'react';
import { AuthContextType } from '@/types/auth';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useAuthAPI } from '@/hooks/useAuthAPI';
import { toast } from 'sonner';

// AuthContext ստեղծում
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuthSession();
  const { login, logout, registerUser, verifyEmail, approveRegistration, getPendingUsers } = useAuthAPI();

  // Helper functions to pass current user to API functions
  const handleApproveRegistration = async (userId: string): Promise<boolean> => {
    return approveRegistration(userId, user);
  };

  const handleGetPendingUsers = async (): Promise<any[]> => {
    return getPendingUsers(user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        registerUser,
        verifyEmail,
        approveRegistration: handleApproveRegistration,
        getPendingUsers: handleGetPendingUsers
      }}
    >
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
