
import { useCallback } from 'react';
import { useSession } from './useSession';
import { 
  login, 
  logout, 
  sendVerificationEmail, 
  verifyEmail, 
  resetPassword, 
  updatePassword,
} from '../operations';
import { registerUser } from '../operations/userOperations';

export function useAuthProvider() {
  const { 
    user, 
    isAuthenticated, 
    isApproved, 
    loading, 
    error, 
    setUser, 
    refreshUser 
  } = useSession();

  const handleLogout = useCallback(async () => {
    console.log('Logging out user');
    await logout();
    setUser(null);
  }, [setUser]);

  return {
    user,
    isAuthenticated,
    isApproved,
    loading,
    error,
    login,
    logout: handleLogout,
    registerUser,
    sendVerificationEmail,
    verifyEmail,
    resetPassword,
    updatePassword,
    setUser,
    refreshUser
  };
}
