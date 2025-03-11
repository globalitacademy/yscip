
import { useSession } from './hooks/useSession';
import { login, logout, sendVerificationEmail, verifyEmail, resetPassword, updatePassword } from './operations/authOperations';
import { registerUser } from './operations/userOperations';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useAuthProvider() {
  const { user, isAuthenticated, isApproved, loading, setUser, refreshUser } = useSession();

  // Listen for auth state changes
  useEffect(() => {
    console.log('Setting up auth state change listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log('User signed in or token refreshed, refreshing user data');
          await refreshUser(session);
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing user data');
          setUser(null);
        } else if (event === 'USER_UPDATED') {
          console.log('User data updated, refreshing user data');
          await refreshUser(session);
        } else if (event === 'PASSWORD_RECOVERY') {
          console.log('Password recovery event detected');
          // Handle password recovery if needed
        }
      }
    );

    return () => {
      console.log('Cleaning up auth state change listener');
      subscription?.unsubscribe();
    };
  }, [setUser, refreshUser]);

  return {
    user,
    isAuthenticated,
    isApproved,
    loading,
    login,
    logout: async () => {
      console.log('Logging out user');
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
