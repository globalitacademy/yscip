
import { useState } from 'react';
import { User, UserRole } from '@/types/user';
import { mockUsers } from '@/data/mockUsers';
import { PendingUser } from '@/types/auth';
import { SupabaseClient } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { handleFallbackLogin, handleSignUpUser } from '@/utils/authUtils';
import { mainAdminUser } from './mockAdminUsers';

export const useAuthOperations = (
  user: User | null,
  pendingUsers: PendingUser[],
  setPendingUsers: React.Dispatch<React.SetStateAction<PendingUser[]>>,
  supabase: SupabaseClient
) => {
  const [loginAttempts, setLoginAttempts] = useState(0);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login with email:', email);
      // Track login attempts
      setLoginAttempts(prev => prev + 1);
      
      // Special handling for main admin account
      if (email.toLowerCase() === 'gitedu@bk.ru' && password === 'Qolej2025*') {
        console.log('Login attempt for main admin, using direct access');
        
        // Try to activate admin account in background
        try {
          await supabase.functions.invoke('ensure-admin-activation');
        } catch (error) {
          console.error('Error invoking admin activation function:', error);
        }
        
        // Direct login via Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'gitedu@bk.ru',
          password: 'Qolej2025*'
        });
        
        if (error) {
          console.error('Error signing in as admin:', error);
          // If Supabase login fails, use the fallback admin login
          localStorage.setItem('currentUser', JSON.stringify(mainAdminUser));
          return true;
        }
        
        return true;
      }
      
      // Regular login via Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Supabase login error:', error);
        return handleFallbackLogin(email, password, pendingUsers, mockUsers);
      }
      
      // Success is handled by the auth state change listener in useRealTimeSession
      return !!data.user;
    } catch (error) {
      console.error('Login error:', error);
      return handleFallbackLogin(email, password, pendingUsers, mockUsers);
    }
  };

  const registerUser = async (userData: Partial<User> & { password: string }): Promise<{success: boolean, token?: string}> => {
    try {
      console.log('Registering new user:', userData.email, userData.role);
      
      const emailExists = mockUsers.some(user => user.email.toLowerCase() === userData.email?.toLowerCase());
      if (emailExists) {
        toast.error('Այս էլ․ հասցեն արդեն գրանցված է։');
        return { success: false };
      }
      
      const pendingEmailExists = pendingUsers.some(user => user.email?.toLowerCase() === userData.email?.toLowerCase());
      if (pendingEmailExists) {
        toast.error('Այս էլ․ հասցեով գրանցումն արդեն սպասման մեջ է։ Խնդրում ենք ստուգել Ձեր էլ․ փոստը։');
        return { success: false };
      }

      // Try Supabase registration
      const { data, error } = await supabase.auth.signUp({
        email: userData.email || '',
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: userData.role,
            organization: userData.organization
          },
          emailRedirectTo: `${window.location.origin}/verify-email`
        }
      });
      
      if (error) {
        console.error('Supabase registration error:', error);
        return handleSignUpUser(userData, pendingUsers, setPendingUsers);
      }

      console.log('Registration successful via Supabase:', data);
      
      // Success message based on role
      toast.success(
        `Գրանցման հայտն ընդունված է։ Խնդրում ենք ստուգել Ձեր էլ․ փոստը՝ հաշիվը ակտիվացնելու համար։${
          userData.role !== 'student' ? ' Ակտիվացումից հետո Ձեր հաշիվը պետք է հաստատվի ադմինիստրատորի կողմից։' : ''
        }`
      );

      return { success: true, token: data?.user?.confirmation_sent_at ? 'sent' : undefined };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false };
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out user');
      await supabase.auth.signOut();
      // The session change listener will handle the rest
    } catch (error) {
      console.error('Error during logout:', error);
      localStorage.removeItem('currentUser');
    }
  };

  return {
    login,
    logout,
    registerUser,
  };
};
