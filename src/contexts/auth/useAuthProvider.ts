
import { useSession } from './hooks/useSession';
import { login, logout, sendVerificationEmail, verifyEmail, resetPassword, updatePassword } from './operations/authOperations';
import { registerUser } from './operations/userOperations';

export function useAuthProvider() {
  const { user, isAuthenticated, loading, setUser } = useSession();

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout: async () => {
      await logout();
      setUser(null);
    },
    registerUser,
    sendVerificationEmail,
    verifyEmail,
    resetPassword,
    updatePassword
  };
}
