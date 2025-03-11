
import { useCallback, useEffect } from 'react';
import { useSession } from './useSession';
import { 
  login, 
  logout, 
  sendVerificationEmail, 
  verifyEmail, 
  resetPassword, 
  updatePassword,
  registerUser,
  resetAdminAccount
} from '../operations';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DBUser } from '@/types/database.types';

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

  // Listen for auth state changes
  useEffect(() => {
    const handleAuthChange = async (event: string, session: any) => {
      console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session) {
          await refreshUser(session);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    };

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshUser, setUser]);

  const handleLogout = useCallback(async () => {
    console.log('Logging out user');
    try {
      await logout();
      setUser(null);
      toast.success('Դուք հաջողությամբ դուրս եք եկել համակարգից');
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Սխալ համակարգից դուրս գալու ժամանակ');
    }
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
    resetAdminAccount,
    setUser,
    refreshUser
  };
}
